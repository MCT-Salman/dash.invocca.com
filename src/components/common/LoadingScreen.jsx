/**
 * Loading Screen Component
 * شاشة التحميل
 */

import MuiBox from '@/components/ui/MuiBox'
import MuiCircularProgress from '@/components/ui/MuiCircularProgress'
import MuiTypography from '@/components/ui/MuiTypography'

/**
 * Loading Screen
 * @param {Object} props
 * @param {string} props.message - Loading message
 * @param {boolean} props.fullScreen - Show as full screen
 * @param {string} props.size - Size of spinner (small, medium, large)
 */
export default function LoadingScreen({
    message = 'جاري التحميل...',
    fullScreen = true,
    size = 'large',
}) {
    const spinnerSize = {
        small: 30,
        medium: 50,
        large: 70,
    }[size] || 50

    const containerClasses = fullScreen
        ? 'flex flex-col items-center justify-center min-h-screen gap-6'
        : 'flex flex-col items-center justify-center p-8 gap-4'

    return (
        <MuiBox className={containerClasses}>
            <MuiCircularProgress size={spinnerSize} thickness={4} />

            {message && (
                <MuiTypography variant="body1" className="text-text-secondary">
                    {message}
                </MuiTypography>
            )}
        </MuiBox>
    )
}

/**
 * Inline Loading Component
 * For use within components
 */
export function InlineLoading({ message, size = 'small' }) {
    return <LoadingScreen message={message} fullScreen={false} size={size} />
}

/**
 * Button Loading Component
 * For use in buttons
 */
export function ButtonLoading({ size = 20 }) {
    return <MuiCircularProgress size={size} thickness={4} color="inherit" />
}
