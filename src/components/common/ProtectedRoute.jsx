// src\components\common\ProtectedRoute.jsx
/**
 * Protected Route Component
 * مسار محمي يتطلب تسجيل دخول
 */

import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks'
import { LoadingScreen } from '@/components/common'
import { ROUTES } from '@/config/constants'

/**
 * Protected Route
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.requiredRole - Required user role (optional)
 */
export default function ProtectedRoute({ children, requiredRole }) {
    const { isAuthenticated, isLoading, user } = useAuth()

    // Show loading while checking auth
    if (isLoading) {
        return <LoadingScreen message="جاري التحقق..." />
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to={ROUTES.AUTH.LOGIN} replace />
    }

    // Check role if required
    if (requiredRole) {
        // Scanner role should be treated as employee
        const userRole = user?.role === 'scanner' ? 'employee' : user?.role
        const requiredRoleNormalized = requiredRole === 'scanner' ? 'employee' : requiredRole
        
        if (userRole !== requiredRoleNormalized) {
            return <Navigate to={ROUTES.HOME} replace />
        }
    }

    return children
}
