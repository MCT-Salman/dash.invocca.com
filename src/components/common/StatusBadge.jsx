import MuiChip from '@/components/ui/MuiChip'
import { CheckCircle, XCircle, Clock, AlertCircle, HelpCircle, Send } from 'lucide-react'

const STATUS_CONFIG = {
    active: {
        label: 'نشط',
        color: '#22c55e',
        bgColor: 'rgba(34, 197, 94, 0.12)',
        icon: CheckCircle
    },
    inactive: {
        label: 'معطل',
        color: '#ef4444',
        bgColor: 'rgba(239, 68, 68, 0.12)',
        icon: XCircle
    },
    pending: {
        label: 'قيد الانتظار',
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.12)',
        icon: Clock
    },
    confirmed: {
        label: 'مؤكد',
        color: '#10b981',
        bgColor: 'rgba(16, 185, 129, 0.12)',
        icon: CheckCircle
    },
    in_progress: {
        label: 'جاري التنفيذ',
        color: '#f97316',
        bgColor: 'rgba(249, 115, 22, 0.12)',
        icon: Clock
    },
    completed: {
        label: 'مكتمل',
        color: '#3b82f6',
        bgColor: 'rgba(59, 130, 246, 0.12)',
        icon: CheckCircle
    },
    cancelled: {
        label: 'ملغي',
        color: '#6b7280',
        bgColor: 'rgba(107, 114, 128, 0.12)',
        icon: XCircle
    },
    sent: {
        label: 'تم الإرسال',
        color: '#d97706',
        bgColor: 'rgba(217, 119, 6, 0.12)',
        icon: Send
    },
    error: {
        label: 'خطأ',
        color: '#dc2626',
        bgColor: 'rgba(220, 38, 38, 0.12)',
        icon: AlertCircle
    },
    paid: {
        label: 'مدفوع',
        color: '#10b981',
        bgColor: 'rgba(16, 185, 129, 0.12)',
        icon: CheckCircle
    },
    unpaid: {
        label: 'غير مدفوع',
        color: '#ef4444',
        bgColor: 'rgba(239, 68, 68, 0.12)',
        icon: XCircle
    },
    partial: {
        label: 'مدفوع جزئياً',
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.12)',
        icon: Clock
    }
}

export default function StatusBadge({
    value,
    type, // explicitly provide type if value is not boolean
    activeLabel,
    inactiveLabel,
    size = 'small',
}) {
    // Determine status key
    let statusKey = 'inactive'
    if (type) {
        statusKey = type
    } else if (typeof value === 'boolean') {
        statusKey = value ? 'active' : 'inactive'
    } else if (typeof value === 'string') {
        statusKey = value.toLowerCase()
    }

    const config = STATUS_CONFIG[statusKey] || {
        label: value || 'غير معروف',
        color: '#6b7280',
        bgColor: 'rgba(107, 114, 128, 0.12)',
        icon: HelpCircle
    }

    const Icon = config.icon
    const label = (statusKey === 'active' && activeLabel) ? activeLabel : 
                  (statusKey === 'inactive' && inactiveLabel) ? inactiveLabel : 
                  config.label

    return (
        <MuiChip
            label={label}
            size={size}
            icon={<Icon size={14} />}
            sx={{
                backgroundColor: `${config.bgColor} !important`,
                color: `${config.color} !important`,
                border: `1px solid ${config.color}33 !important`,
                fontWeight: 600,
                borderRadius: '8px',
                px: 0.5,
                '& .MuiChip-icon': {
                    color: 'inherit !important',
                },
                '&.MuiChip-root': {
                    backgroundColor: `${config.bgColor} !important`,
                    color: `${config.color} !important`,
                },
            }}
        />
    )
}
