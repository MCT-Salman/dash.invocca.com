// src\providers\AppProvider.jsx
/**
 * App Provider
 * يجمع جميع الـ Providers في مكان واحد
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { ErrorBoundary } from '@/components/common'
import { createAppTheme } from '@/theme/theme'
import { useMemo } from 'react'

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
 * MUI Theme Wrapper
 * Connects MUI theme to our custom ThemeContext
 */
function MuiThemeWrapper({ children }) {
    const { theme } = useTheme()
    const muiTheme = useMemo(() => createAppTheme(theme), [theme])

    return (
        <MuiThemeProvider theme={muiTheme}>
            {children}
        </MuiThemeProvider>
    )
}

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
                        <MuiThemeWrapper>
                            <AuthProvider>
                                <NotificationProvider>
                                    {children}
                                </NotificationProvider>
                            </AuthProvider>
                        </MuiThemeWrapper>
                    </ThemeProvider>
                </BrowserRouter>
            </QueryClientProvider>
        </ErrorBoundary>
    )
}
