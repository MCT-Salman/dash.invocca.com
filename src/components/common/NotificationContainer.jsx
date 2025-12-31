/**
 * Notification Container Component
 * حاوية عرض الإشعارات (Toasts)
 */

import { useNotification } from '@/hooks'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiIconButton from '@/components/ui/MuiIconButton'

/**
 * Toast Item Component
 */
function ToastItem({ notification, onClose }) {
    const colors = {
        success: {
            bg: '#4CAF50',
            text: '#FFFFFF',
            icon: '✓',
        },
        error: {
            bg: '#F44336',
            text: '#FFFFFF',
            icon: '✕',
        },
        warning: {
            bg: '#FF9800',
            text: '#FFFFFF',
            icon: '⚠',
        },
        info: {
            bg: '#2196F3',
            text: '#FFFFFF',
            icon: 'ℹ',
        },
    }

    const color = colors[notification.type] || colors.info

    return (
        <MuiBox
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                padding: '12px 16px',
                backgroundColor: color.bg,
                color: color.text,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                minWidth: 300,
                maxWidth: 500,
                animation: 'slideIn 0.3s ease-out',
                '@keyframes slideIn': {
                    from: {
                        transform: 'translateX(100%)',
                        opacity: 0,
                    },
                    to: {
                        transform: 'translateX(0)',
                        opacity: 1,
                    },
                },
            }}
        >
            {/* Icon */}
            <MuiBox
                sx={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    lineHeight: 1,
                }}
            >
                {color.icon}
            </MuiBox>

            {/* Message */}
            <MuiTypography
                sx={{
                    flex: 1,
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: color.text,
                }}
            >
                {notification.message}
            </MuiTypography>

            {/* Close Button */}
            <MuiIconButton
                onClick={onClose}
                sx={{
                    padding: 0.5,
                    color: color.text,
                    '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                }}
            >
                <MuiBox sx={{ fontSize: '1.25rem', lineHeight: 1 }}>×</MuiBox>
            </MuiIconButton>
        </MuiBox>
    )
}

/**
 * Notification Container
 * Displays all active notifications
 */
export default function NotificationContainer() {
    const { notifications, removeNotification } = useNotification()

    if (notifications.length === 0) return null

    return (
        <MuiBox
            sx={{
                position: 'fixed',
                top: 24,
                right: 24,
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                pointerEvents: 'none',
            }}
        >
            {notifications.map((notification) => (
                <MuiBox
                    key={notification.id}
                    sx={{ pointerEvents: 'auto' }}
                >
                    <ToastItem
                        notification={notification}
                        onClose={() => removeNotification(notification.id)}
                    />
                </MuiBox>
            ))}
        </MuiBox>
    )
}
