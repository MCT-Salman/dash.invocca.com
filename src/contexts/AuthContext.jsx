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
    const [refreshToken, setRefreshToken] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // ─────────────────────────────────────────────────────────
    // Initialize auth state from storage
    // ─────────────────────────────────────────────────────────

    useEffect(() => {
        const initAuth = () => {
            try {
                // Get tokens as raw string (not JSON.parse)
                const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
                const storedRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
                // Get user as JSON object
                const storedUser = getStorageItem(STORAGE_KEYS.USER)

                if (storedToken && storedUser) {
                    setToken(storedToken)
                    setRefreshToken(storedRefreshToken)
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

    const navigateByRole = useCallback((roles) => {
        // Handle roles as array - get the primary role for navigation
        const roleArray = Array.isArray(roles) ? roles : [roles]
        const primaryRole = roleArray[0] // Use first role as primary
        
        // console.log('🧭 Navigation - Input roles:', roles)
        // console.log('🧭 Navigation - Role array:', roleArray)
        // console.log('🧭 Navigation - Primary role:', primaryRole)
        // console.log('🧭 Navigation - Target route for admin:', ROUTES.ADMIN.DASHBOARD)
        
        switch (primaryRole) {
            case USER_ROLES.ADMIN:
                // console.log('🧭 Navigating to Admin Dashboard')
                navigate(ROUTES.ADMIN.DASHBOARD)
                break
            case USER_ROLES.MANAGER:
                // console.log('🧭 Navigating to Manager Dashboard')
                navigate(ROUTES.MANAGER.DASHBOARD)
                break
            case USER_ROLES.CLIENT:
                // console.log('🧭 Navigating to Client Dashboard')
                navigate(ROUTES.CLIENT.DASHBOARD)
                break
            case USER_ROLES.EMPLOYEE:
            case 'scanner': // Scanner role maps to employee routes
                // console.log('🧭 Navigating to Employee Dashboard')
                navigate(ROUTES.EMPLOYEE.DASHBOARD)
                break
            default:
                // console.log('🧭 Navigating to Home (default)')
                navigate(ROUTES.HOME)
        }
    }, [navigate])

    const login = useCallback(async (phone, password) => {
        try {
            const data = await authAPI.login(phone, password)

            if (data?.data?.accessToken && data?.data?.user) {
                const { accessToken, refreshToken: newRefreshToken } = data.data
                const userData = data.data.user

                // Update state
                setToken(accessToken)
                setRefreshToken(newRefreshToken)
                setUser(userData)
                setIsAuthenticated(true)

                // Persist to storage
                // Store tokens as raw string (not JSON.stringify)
                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
                if (newRefreshToken) {
                    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken)
                }
                // Store user as JSON string
                setStorageItem(STORAGE_KEYS.USER, userData)

                // Navigate based on role (now array)
                // console.log('🚀 Login - User role:', userData.role)
                // console.log('🚀 Login - Role type:', typeof userData.role)
                // console.log('🚀 Login - Is array:', Array.isArray(userData.role))
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

                // Navigate based on role (now array)
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
            setRefreshToken(null)
            setUser(null)
            setIsAuthenticated(false)

            // Clear storage
            removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN)
            removeStorageItem(STORAGE_KEYS.REFRESH_TOKEN)
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
    // Refresh Access Token
    // ─────────────────────────────────────────────────────────

    const doRefreshToken = useCallback(async () => {
        try {
            const currentRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
            if (!currentRefreshToken) {
                throw new Error('No refresh token available')
            }

            const data = await authAPI.refreshToken(currentRefreshToken)

            if (data?.data?.accessToken) {
                const { accessToken, refreshToken: newRefreshToken } = data.data

                // Update state
                setToken(accessToken)
                if (newRefreshToken) {
                    setRefreshToken(newRefreshToken)
                    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken)
                }

                // Persist to storage
                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)

                return { success: true, accessToken, refreshToken: newRefreshToken }
            }

            return { success: false, error: 'Invalid response from server' }
        } catch (error) {
            // If refresh fails, logout the user
            logout()
            return { success: false, error: error.message || 'فشل تجديد الجلسة' }
        }
    }, [logout])

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
        // Handle roles as array - check if user has the specified role
        const userRoles = Array.isArray(user?.role) ? user.role : [user?.role]
        return userRoles.includes(role)
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
        refreshToken,
        isLoading,
        isAuthenticated,

        // Actions
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
        doRefreshToken,

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
