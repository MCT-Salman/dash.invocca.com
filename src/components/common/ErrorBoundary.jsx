/**
 * Error Boundary Component
 * معالجة الأخطاء في React
 */

import { Component } from 'react'
import MuiBox from '@/components/ui/MuiBox'
import MuiButton from '@/components/ui/MuiButton'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'

class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        }
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console in development
        if (import.meta.env.DEV) {
            console.error('Error caught by ErrorBoundary:', error, errorInfo)
        }

        // Update state with error details
        this.setState({
            error,
            errorInfo,
        })

        // You can also log the error to an error reporting service here
        // logErrorToService(error, errorInfo)
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        })
    }

    handleReload = () => {
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback
            }

            // Default fallback UI
            return (
                <MuiBox className="flex items-center justify-center min-h-screen p-6 bg-surface">
                    <MuiPaper
                        elevation={3}
                        className="p-8 max-w-2xl w-full text-center rounded-2xl shadow-lg"
                    >
                        <MuiTypography variant="h4" className="mb-4 text-error-500 font-bold">
                            عذراً، حدث خطأ ما
                        </MuiTypography>

                        <MuiTypography variant="body1" className="text-text-secondary mb-6">
                            حدث خطأ غير متوقع في التطبيق. نعتذر عن الإزعاج.
                        </MuiTypography>

                        {import.meta.env.DEV && this.state.error && (
                            <MuiBox className="mt-6 p-4 bg-gray-100 rounded-lg text-left overflow-auto" dir="ltr">
                                <MuiTypography
                                    variant="body2"
                                    component="pre"
                                    className="font-mono text-sm m-0 whitespace-pre-wrap break-words"
                                >
                                    {this.state.error.toString()}
                                    {'\n\n'}
                                    {this.state.errorInfo?.componentStack}
                                </MuiTypography>
                            </MuiBox>
                        )}

                        <MuiBox className="mt-6 flex gap-4 justify-center flex-wrap">
                            <MuiButton variant="contained" color="primary" onClick={this.handleReset}>
                                حاول مرة أخرى
                            </MuiButton>

                            <MuiButton variant="outlined" color="primary" onClick={this.handleReload}>
                                إعادة تحميل الصفحة
                            </MuiButton>
                        </MuiBox>
                    </MuiPaper>
                </MuiBox>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
