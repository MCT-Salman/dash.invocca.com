// src\pages\manager\ManagerDashboard.jsx
/**
 * Manager Dashboard Page
 * لوحة تحكم المدير - تصميم محسّن ومتجاوب
 */

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useAuth } from '@/hooks'
import { normalizeDashboardStats, computeStatsFromEvents } from '@/api/utils/normalizers'
import MuiBox from '@/components/ui/MuiBox'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiChip from '@/components/ui/MuiChip'
import MuiDivider from '@/components/ui/MuiDivider'
import { LoadingScreen, EmptyState, SEOHead } from '@/components/common'
import { QUERY_KEYS } from '@/config/constants'
import { getManagerDashboard, getManagerEvents } from '@/api/manager'
import { formatNumber, formatCurrency } from '@/utils/helpers'
import {
    Building2,
    Calendar,
    DollarSign,
    CheckCircle,
    Clock,
    AlertCircle,
    Users,
    TrendingUp,
    Star,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    LayoutDashboard,
    UserPlus,
    FileText,
    Music
} from 'lucide-react'

const statsConfig = [
    {
        key: 'totalEvents',
        title: 'إجمالي الفعاليات',
        icon: Calendar,
        formatter: formatNumber,
        color: 'primary',
    },
    {
        key: 'todayBookings',
        title: 'حجوزات اليوم',
        icon: Clock,
        formatter: formatNumber,
        color: 'warning',
    },
    {
        key: 'activeBookings',
        title: 'الحجوزات النشطة',
        icon: CheckCircle,
        formatter: formatNumber,
        color: 'success',
    },
    {
        key: 'monthlyRevenue',
        title: 'الإيرادات الشهرية',
        icon: DollarSign,
        formatter: formatCurrency,
        color: 'info',
    },
]

/**
 * Manager Dashboard Content
 */
function ManagerDashboardContent() {
    // Hooks must be called before any early returns
    const { user } = useAuth()

    // Fetch dashboard data
    const { data, isLoading, error } = useQuery({
        queryKey: [QUERY_KEYS.MANAGER_DASHBOARD],
        queryFn: getManagerDashboard,
    })

    // Normalize dashboard stats
    const normalizedStats = useMemo(() => normalizeDashboardStats(data), [data])

    // Check if totalEvents needs to be calculated from events
    const needsEventsData = useMemo(() => {
        if (isLoading || !data) return false
        return !normalizedStats.totalEvents || normalizedStats.totalEvents === 0
    }, [isLoading, data, normalizedStats.totalEvents])

    // Fetch events to calculate totalEvents if not provided by dashboard API
    const { data: eventsData } = useQuery({
        queryKey: [QUERY_KEYS.MANAGER_EVENTS],
        queryFn: getManagerEvents,
        enabled: needsEventsData, // Only fetch if totalEvents is missing or 0
    })

    // If totalEvents is missing or 0, calculate it from events
    // This hook must be called before any early returns to maintain hooks order
    const stats = useMemo(() => {
        let finalStats = { ...normalizedStats }

        if (needsEventsData && eventsData) {
            const events = Array.isArray(eventsData?.events)
                ? eventsData.events
                : Array.isArray(eventsData?.data)
                    ? eventsData.data
                    : Array.isArray(eventsData)
                        ? eventsData
                        : []

            if (events.length > 0) {
                const computedStats = computeStatsFromEvents(events)
                finalStats = {
                    ...finalStats,
                    totalEvents: computedStats.totalEvents || events.length,
                    todayBookings: finalStats.todayBookings || computedStats.todayBookings || 0,
                    activeBookings: finalStats.activeBookings || computedStats.activeBookings || 0,
                }
            }
        }

        return finalStats
    }, [normalizedStats, needsEventsData, eventsData])

    if (isLoading) {
        return <LoadingScreen message="جاري تحميل البيانات..." fullScreen={false} />
    }

    if (error) {
        return (
            <EmptyState
                title="حدث خطأ"
                description={error.message || 'فشل تحميل البيانات'}
                icon={AlertCircle}
                showPaper
            />
        )
    }

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-bg)' }}>
            <SEOHead pageKey="managerDashboard" />

            {/* Header Section - Premium Welcome Card */}
            <MuiBox
                sx={{
                    mb: 4,
                    p: { xs: 3, sm: 4 },
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-800) 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-xl)',
                }}
            >
                <MuiBox sx={{ position: 'relative', zIndex: 1 }}>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                        <MuiBox
                            sx={{
                                width: { xs: 64, sm: 72 },
                                height: { xs: 64, sm: 72 },
                                borderRadius: '20px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            <LayoutDashboard size={36} style={{ color: '#fff' }} />
                        </MuiBox>
                        <MuiBox sx={{ flex: 1 }}>
                            <MuiTypography
                                variant="h4"
                                sx={{
                                    color: '#fff',
                                    fontWeight: 800,
                                    mb: 1,
                                    fontSize: { xs: '1.5rem', sm: '2rem' },
                                }}
                            >
                                مرحباً، {user?.name || 'المدير'}
                            </MuiTypography>
                            <MuiTypography
                                variant="body1"
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                    fontWeight: 500,
                                }}
                            >
                                نظرة شاملة على قاعتك وفعالياتك • {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </MuiTypography>
                        </MuiBox>
                    </MuiBox>
                </MuiBox>

                {/* Background Decor */}
                <MuiBox
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        opacity: 0.1,
                        background: 'radial-gradient(circle at top right, #fff 0%, transparent 60%)',
                    }}
                />
            </MuiBox>

            {/* Stats Grid */}
            <MuiGrid
                container
                spacing={3}
                sx={{ mb: 4 }}
            >
                {statsConfig.map((config) => (
                    <MuiGrid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={3}
                        key={config.key}
                    >
                        <MuiPaper
                            elevation={0}
                            sx={{
                                p: 3,
                                height: '100%',
                                background: 'var(--color-paper)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '20px',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 'var(--shadow-lg)',
                                    borderColor: `var(--color-${config.color}-300)`,
                                }
                            }}
                        >
                            <MuiBox sx={{ position: 'relative', zIndex: 1 }}>
                                <MuiBox sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                                    <MuiBox sx={{ flex: 1 }}>
                                        <MuiTypography
                                            variant="body2"
                                            sx={{
                                                color: 'var(--color-text-secondary)',
                                                mb: 1,
                                                fontWeight: 600,
                                            }}
                                        >
                                            {config.title}
                                        </MuiTypography>
                                        <MuiTypography
                                            variant="h4"
                                            sx={{
                                                color: 'var(--color-text-primary)',
                                                fontWeight: 800,
                                                fontSize: '1.75rem',
                                            }}
                                        >
                                            {config.formatter(stats[config.key] || 0)}
                                        </MuiTypography>
                                    </MuiBox>
                                    <MuiBox
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: '16px',
                                            background: `var(--color-${config.color}-50)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: `var(--color-${config.color}-500)`,
                                        }}
                                    >
                                        <config.icon size={28} strokeWidth={2} />
                                    </MuiBox>
                                </MuiBox>

                                {/* Trend Indicator */}
                                {stats[`${config.key}Trend`] && (
                                    <MuiBox
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            mt: 1
                                        }}
                                    >
                                        <MuiBox
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                color: stats[`${config.key}Trend`] > 0 ? 'var(--color-success-600)' : 'var(--color-error-600)',
                                                gap: 0.5,
                                                bgcolor: stats[`${config.key}Trend`] > 0 ? 'var(--color-success-50)' : 'var(--color-error-50)',
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: '8px',
                                                fontSize: '0.75rem',
                                                fontWeight: 700
                                            }}
                                        >
                                            {stats[`${config.key}Trend`] > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                            {Math.abs(stats[`${config.key}Trend`] || 0)}%
                                        </MuiBox>
                                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                            من الشهر الماضي
                                        </MuiTypography>
                                    </MuiBox>
                                )}
                            </MuiBox>
                        </MuiPaper>
                    </MuiGrid>
                ))}
            </MuiGrid>

            {/* Hall Info & Recent Bookings */}
            <MuiGrid
                container
                spacing={{ xs: 2, sm: 2, md: 3 }}
            >
                {/* Hall Info */}
                {stats.hallInfo && (
                    <MuiGrid item xs={12} md={4}>
                        <MuiPaper
                            elevation={0}
                            sx={{
                                background: 'var(--color-paper)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                height: '100%',
                                position: 'relative',
                                boxShadow: 'var(--shadow-lg)'
                            }}
                        >
                            {/* Header */}
                            <MuiBox sx={{
                                p: 3,
                                background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))',
                                position: 'relative',
                                zIndex: 1
                            }}>
                                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <MuiBox sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '12px',
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        backdropFilter: 'blur(10px)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Building2 size={24} style={{ color: '#fff' }} strokeWidth={2.5} />
                                    </MuiBox>
                                    <MuiTypography variant="h6" sx={{
                                        fontWeight: 700,
                                        color: '#fff'
                                    }}>
                                        معلومات قاعة/صالة
                                    </MuiTypography>
                                </MuiBox>
                            </MuiBox>

                            {/* Content */}
                            <MuiBox sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                                <MuiBox sx={{ mb: 3 }}>
                                    <MuiTypography variant="caption" sx={{
                                        color: 'var(--color-text-secondary)',
                                        mb: 1,
                                        display: 'block',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5
                                    }}>
                                        اسم قاعة/صالة
                                    </MuiTypography>
                                    <MuiTypography variant="h6" sx={{
                                        fontWeight: 700,
                                        color: 'var(--color-text-primary)'
                                    }}>
                                        {stats.hallInfo.name || '-'}
                                    </MuiTypography>
                                </MuiBox>

                                <MuiDivider sx={{ mb: 3 }} />

                                <MuiBox sx={{ mb: 3 }}>
                                    <MuiTypography variant="caption" sx={{
                                        color: 'var(--color-text-secondary)',
                                        mb: 1,
                                        display: 'block',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5
                                    }}>
                                        الموقع
                                    </MuiTypography>
                                    <MuiTypography variant="body1" sx={{
                                        fontWeight: 500,
                                        color: 'var(--color-text-primary)'
                                    }}>
                                        {stats.hallInfo.location || '-'}
                                    </MuiTypography>
                                </MuiBox>

                                <MuiDivider sx={{ mb: 3 }} />

                                <MuiBox sx={{ display: 'flex', gap: 3 }}>
                                    <MuiBox sx={{
                                        flex: 1,
                                        p: 3,
                                        borderRadius: '16px',
                                        background: 'var(--color-primary-50)',
                                        border: '1px solid var(--color-primary-100)',
                                        textAlign: 'center'
                                    }}>
                                        <MuiTypography variant="caption" sx={{
                                            color: 'var(--color-primary-600)',
                                            display: 'block',
                                            mb: 1,
                                            fontWeight: 600
                                        }}>
                                            الطاولات
                                        </MuiTypography>
                                        <MuiTypography variant="h4" sx={{
                                            fontWeight: 700,
                                            color: 'var(--color-primary-700)'
                                        }}>
                                            {stats.hallInfo.tables || 0}
                                        </MuiTypography>
                                    </MuiBox>

                                    <MuiBox sx={{
                                        flex: 1,
                                        p: 3,
                                        borderRadius: '16px',
                                        background: 'var(--color-secondary-50)',
                                        border: '1px solid var(--color-secondary-100)',
                                        textAlign: 'center'
                                    }}>
                                        <MuiTypography variant="caption" sx={{
                                            color: 'var(--color-secondary-600)',
                                            display: 'block',
                                            mb: 1,
                                            fontWeight: 600
                                        }}>
                                            الكراسي
                                        </MuiTypography>
                                        <MuiTypography variant="h4" sx={{
                                            fontWeight: 700,
                                            color: 'var(--color-secondary-700)'
                                        }}>
                                            {stats.hallInfo.chairs || 0}
                                        </MuiTypography>
                                    </MuiBox>
                                </MuiBox>
                            </MuiBox>
                        </MuiPaper>
                    </MuiGrid>
                )}

                {/* Recent Bookings */}
                <MuiGrid item xs={12} md={stats.hallInfo ? 8 : 12}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            background: 'var(--color-paper)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            height: '100%',
                            position: 'relative',
                            boxShadow: 'var(--shadow-lg)'
                        }}
                    >
                        {/* Header */}
                        <MuiBox sx={{
                            p: 3,
                            borderBottom: '1px solid var(--color-border)',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <MuiBox sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '12px',
                                        background: 'var(--color-primary-50)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--color-primary-600)'
                                    }}>
                                        <Calendar size={24} strokeWidth={2.5} />
                                    </MuiBox>
                                    <MuiBox>
                                        <MuiTypography variant="h6" sx={{
                                            fontWeight: 700,
                                            color: 'var(--color-text-primary)'
                                        }}>
                                            الحجوزات الأخيرة
                                        </MuiTypography>
                                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                            آخر {stats.recentBookings?.length || 0} حجوزات
                                        </MuiTypography>
                                    </MuiBox>
                                </MuiBox>
                            </MuiBox>
                        </MuiBox>

                        {/* Content */}
                        {stats.recentBookings && stats.recentBookings.length > 0 ? (
                            <MuiBox sx={{ position: 'relative', zIndex: 1 }}>
                                {stats.recentBookings.map((booking, index) => (
                                    <MuiBox
                                        key={`${booking.clientName}-${index}`}
                                        sx={{
                                            p: 3,
                                            transition: 'all 0.3s ease',
                                            borderBottom: '1px solid var(--color-border)',
                                            '&:hover': {
                                                background: 'var(--color-surface-hover)'
                                            },
                                            '&:last-child': {
                                                borderBottom: 'none'
                                            }
                                        }}
                                    >
                                        <MuiBox sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 3, mb: 2 }}>
                                            <MuiBox sx={{ flex: 1 }}>
                                                <MuiTypography variant="h6" sx={{
                                                    fontWeight: 700,
                                                    color: 'var(--color-text-primary)',
                                                    mb: 1,
                                                    transition: 'color 0.3s ease',
                                                    '&:hover': {
                                                        color: 'var(--color-primary-600)'
                                                    }
                                                }}>
                                                    {booking.clientName}
                                                </MuiTypography>
                                                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                                    <MuiChip
                                                        label={typeof booking.eventType === 'object' ? (booking.eventType.label || booking.eventType.name || String(booking.eventType)) : (booking.eventType || 'فعالية')}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: 'var(--color-primary-50)',
                                                            color: 'var(--color-primary-700)',
                                                            fontWeight: 600,
                                                            fontSize: '0.75rem',
                                                            height: 24,
                                                            border: '1px solid var(--color-primary-100)'
                                                        }}
                                                    />
                                                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                                        • {booking.date}
                                                    </MuiTypography>
                                                </MuiBox>
                                            </MuiBox>

                                            <MuiChip
                                                label={booking.status === 'confirmed' ? 'مؤكد' : 'قيد الانتظار'}
                                                size="small"
                                                sx={{
                                                    backgroundColor: booking.status === 'confirmed' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(216, 185, 138, 0.1)',
                                                    color: booking.status === 'confirmed' ? '#22c55e' : 'var(--color-primary-500)',
                                                    fontWeight: 700,
                                                    fontSize: '0.75rem',
                                                    height: 28,
                                                    borderRadius: '8px',
                                                    border: booking.status === 'confirmed' ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(216, 185, 138, 0.2)'
                                                }}
                                            />
                                        </MuiBox>

                                        {booking.phone && (
                                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                                                <MuiBox sx={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: '8px',
                                                    background: 'rgba(216, 185, 138, 0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Users size={16} style={{ color: 'var(--color-primary-500)' }} />
                                                </MuiBox>
                                                <MuiTypography variant="body2" sx={{
                                                    color: 'var(--color-text-secondary)',
                                                    fontWeight: 500
                                                }}>
                                                    {booking.phone}
                                                </MuiTypography>
                                            </MuiBox>
                                        )}
                                    </MuiBox>
                                ))}
                            </MuiBox>
                        ) : (
                            <MuiBox sx={{ p: 6, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                                <Calendar size={64} style={{
                                    color: 'var(--color-text-disabled)',
                                    opacity: 0.5,
                                    margin: '0 auto 1rem'
                                }} />
                                <MuiTypography variant="h6" sx={{
                                    color: 'var(--color-text-secondary)',
                                    mb: 2,
                                    fontWeight: 700
                                }}>
                                    لا توجد حجوزات
                                </MuiTypography>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-disabled)' }}>
                                    لم يتم تسجيل أي حجوزات حتى الآن
                                </MuiTypography>
                            </MuiBox>
                        )}
                    </MuiPaper>
                </MuiGrid>
            </MuiGrid>
        </MuiBox>
    )
}

function InfoField({ label, value, prominent = false }) {
    return (
        <MuiBox>
            <MuiTypography variant="caption" className="text-text-secondary block mb-1">
                {label}
            </MuiTypography>
            <MuiTypography
                variant={prominent ? 'h6' : 'body1'}
                className={`${prominent ? 'font-bold text-lg' : 'font-medium text-base'} text-text-primary`}
            >
                {value || '-'}
            </MuiTypography>
        </MuiBox>
    )
}

/**
 * Manager Dashboard Page
 */
export default function ManagerDashboard() {
    return (
        <ManagerDashboardContent />
    )
}
