/**
 * App Provider
 * يجمع جميع الـ Providers في مكان واحد
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { ErrorBoundary } from '@/components/common'

// Create QueryClient instance
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
})

/**
 * App Provider
 * Wraps the app with all necessary providers
 */
export default function AppProvider({ children }) {
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <ThemeProvider>
                        <AuthProvider>
                            <NotificationProvider>
                                {children}
                            </NotificationProvider>
                        </AuthProvider>
                    </ThemeProvider>
                </BrowserRouter>
            </QueryClientProvider>
        </ErrorBoundary>
    )
}
