// src\pages\manager\ManagerDashboard.jsx
/**
 * Manager Dashboard Page
 * لوحة تحكم المدير - تصميم محسّن ومتجاوب
 */

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useAuth } from '@/hooks'
import MuiBox from '@/components/ui/MuiBox'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiChip from '@/components/ui/MuiChip'
import MuiDivider from '@/components/ui/MuiDivider'
import { LoadingScreen, EmptyState, SEOHead } from '@/components/common'
import { QUERY_KEYS } from '@/config/constants'
import { getManagerDashboard } from '@/api/manager'
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
    Music,
    CreditCard,
    Receipt,
    MessageSquare,
    Briefcase,
    MapPin,
    Phone,
    Mail,
    Users2
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
        key: 'upcomingEventsCount',
        title: 'الفعاليات القادمة',
        icon: Clock,
        formatter: formatNumber,
        color: 'warning',
    },
    {
        key: 'confirmedEvents',
        title: 'الفعاليات المؤكدة',
        icon: CheckCircle,
        formatter: formatNumber,
        color: 'success',
    },
    {
        key: 'monthRevenue',
        title: 'إيرادات الشهر',
        icon: DollarSign,
        formatter: (value) => formatCurrency(value, 'SY'),
        color: 'info',
    },
    {
        key: 'totalClients',
        title: 'إجمالي العملاء',
        icon: Users,
        formatter: formatNumber,
        color: 'secondary',
    },
    {
        key: 'totalInvitations',
        title: 'إجمالي الدعوات',
        icon: FileText,
        formatter: formatNumber,
        color: 'primary',
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

    // Normalize dashboard stats from the new API structure
    const stats = useMemo(() => {
        if (!data?.data) return {}

        const { summary, recentActivity, hall, upcomingEvents } = data.data

        return {
            // Events stats
            totalEvents: summary?.events?.total || 0,
            upcomingEventsCount: summary?.events?.upcoming || 0,
            todayEvents: summary?.events?.today || 0,
            thisWeekEvents: summary?.events?.thisWeek || 0,
            thisMonthEvents: summary?.events?.thisMonth || 0,
            completedEvents: summary?.events?.completed || 0,
            cancelledEvents: summary?.events?.cancelled || 0,
            pendingEvents: summary?.events?.pending || 0,
            confirmedEvents: summary?.events?.confirmed || 0,
            inProgressEvents: summary?.events?.inProgress || 0,
            eventsByType: summary?.events?.byType || {},
            eventsByStatus: summary?.events?.byStatus || {},

            // Clients stats
            totalClients: summary?.clients?.total || 0,
            activeClients: summary?.clients?.active || 0,
            newClientsThisMonth: summary?.clients?.newThisMonth || 0,

            // Invitations stats
            totalInvitations: summary?.invitations?.total || 0,
            usedInvitations: summary?.invitations?.used || 0,
            pendingInvitations: summary?.invitations?.pending || 0,
            todayCreatedInvitations: summary?.invitations?.todayCreated || 0,
            checkedInGuests: summary?.invitations?.checkedInGuests || 0,
            invitationsUsageRate: summary?.invitations?.usageRate || '0',

            // Financial stats
            totalRevenue: summary?.financial?.totalRevenue || 0,
            monthRevenue: summary?.financial?.monthRevenue || 0,
            totalPaid: summary?.financial?.totalPaid || 0,
            totalUnpaid: summary?.financial?.totalUnpaid || 0,
            pendingPayments: summary?.financial?.pendingPayments || 0,
            completedPayments: summary?.financial?.completedPayments || 0,
            currency: 'SY',

            // Complaints stats
            totalComplaints: summary?.complaints?.total || 0,
            openComplaints: summary?.complaints?.open || 0,
            resolvedComplaints: summary?.complaints?.resolved || 0,
            urgentComplaints: summary?.complaints?.urgent || 0,
            complaintsByStatus: summary?.complaints?.byStatus || {},

            // Staff stats
            totalStaff: summary?.staff?.total || 0,
            activeStaff: summary?.staff?.active || 0,

            // Hall info
            hallInfo: hall || null,

            // Recent activity
            recentEvents: recentActivity?.events || [],
            recentComplaints: recentActivity?.complaints || [],

            // Upcoming events
            upcomingEvents: upcomingEvents || [],
        }
    }, [data])

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
                                border: '1px solid var(--color-border-glass)',
                                borderRadius: '24px',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    transform: 'translateY(-6px)',
                                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
                                    borderColor: `var(--color-${config.color}-500)`,
                                }
                            }}
                        >
                            <MuiBox sx={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                                    <MuiBox
                                        sx={{
                                            width: 52,
                                            height: 52,
                                            borderRadius: '14px',
                                            background: `rgba(var(--color-${config.color}-500-rgb), 0.1)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: `var(--color-${config.color}-500)`,
                                            border: `1px solid rgba(var(--color-${config.color}-500-rgb), 0.2)`
                                        }}
                                    >
                                        <config.icon size={26} strokeWidth={2.5} />
                                    </MuiBox>
                                    <MuiBox sx={{ textAlign: 'left' }}>
                                        <MuiTypography
                                            variant="caption"
                                            sx={{
                                                color: 'var(--color-text-secondary)',
                                                fontWeight: 700,
                                                letterSpacing: 0.5,
                                                display: 'block',
                                                mb: 0.5,
                                                textAlign: 'right'
                                            }}
                                        >
                                            {config.title}
                                        </MuiTypography>
                                        <MuiTypography
                                            variant="h4"
                                            sx={{
                                                color: 'var(--color-text-primary)',
                                                fontWeight: 900,
                                                fontSize: '1.85rem',
                                                lineHeight: 1,
                                                textAlign: 'right'
                                            }}
                                        >
                                            {config.formatter(stats[config.key] || 0)}
                                        </MuiTypography>
                                    </MuiBox>
                                </MuiBox>

                                <MuiBox sx={{ mt: 'auto' }}>
                                    {stats[`${config.key}Trend`] !== undefined ? (
                                        <MuiBox
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                p: 1,
                                                borderRadius: '10px',
                                                background: 'rgba(255, 255, 255, 0.03)',
                                                border: '1px solid rgba(255, 255, 255, 0.05)'
                                            }}
                                        >
                                            <MuiBox
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    color: stats[`${config.key}Trend`] >= 0 ? '#22c55e' : '#ef4444',
                                                    gap: 0.5,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 800
                                                }}
                                            >
                                                {stats[`${config.key}Trend`] >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                                {Math.abs(stats[`${config.key}Trend`])}%
                                            </MuiBox>
                                            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                                                منذ الشهر الماضي
                                            </MuiTypography>
                                        </MuiBox>
                                    ) : (
                                        <MuiBox sx={{ height: 32, opacity: 0.5, display: 'flex', alignItems: 'center' }}>
                                            <Activity size={14} style={{ marginRight: 8 }} color="var(--color-text-disabled)" />
                                        </MuiBox>
                                    )}
                                </MuiBox>
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
                                            السعة
                                        </MuiTypography>
                                        <MuiTypography variant="h4" sx={{
                                            fontWeight: 700,
                                            color: 'var(--color-primary-700)'
                                        }}>
                                            {stats.hallInfo.capacity || 0}
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
                                            السعر الافتراضي
                                        </MuiTypography>
                                        <MuiTypography variant="h4" sx={{
                                            fontWeight: 700,
                                            color: 'var(--color-secondary-700)'
                                        }}>
                                            {formatCurrency(stats.hallInfo.defaultPrices || 0, 'SY')}
                                        </MuiTypography>
                                    </MuiBox>
                                </MuiBox>
                            </MuiBox>
                        </MuiPaper>
                    </MuiGrid>
                )}

                {/* Recent Events */}
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
                                            الفعاليات الأخيرة
                                        </MuiTypography>
                                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                            آخر {stats.recentEvents?.length || 0} فعاليات
                                        </MuiTypography>
                                    </MuiBox>
                                </MuiBox>
                            </MuiBox>
                        </MuiBox>

                        {/* Content */}
                        {stats.recentEvents && stats.recentEvents.length > 0 ? (
                            <MuiBox sx={{ position: 'relative', zIndex: 1 }}>
                                {stats.recentEvents.map((event, index) => (
                                    <MuiBox
                                        key={event._id || index}
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
                                                    {event.name || 'فعالية بدون اسم'}
                                                </MuiTypography>
                                                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                                    <MuiChip
                                                        label={event.type === 'graduation' ? 'تخرج' : event.type === 'wedding' ? 'زفاف' : event.type === 'birthday' ? 'عيد ميلاد' : event.type === 'other' ? 'أخرى' : event.type || 'فعالية'}
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
                                                        • {event.date ? new Date(event.date).toLocaleDateString('ar-SA') : '-'}
                                                    </MuiTypography>
                                                </MuiBox>
                                            </MuiBox>

                                            <MuiBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                                                <MuiChip
                                                    label={event.status === 'pending' ? 'قيد الانتظار' : event.status === 'confirmed' ? 'مؤكد' : event.status === 'completed' ? 'مكتمل' : event.status || 'نشط'}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: event.status === 'pending' ? 'rgba(216, 185, 138, 0.1)' : event.status === 'confirmed' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                                        color: event.status === 'pending' ? 'var(--color-primary-500)' : event.status === 'confirmed' ? '#22c55e' : '#3b82f6',
                                                        fontWeight: 700,
                                                        fontSize: '0.75rem',
                                                        height: 28,
                                                        borderRadius: '8px',
                                                        border: event.status === 'pending' ? '1px solid rgba(216, 185, 138, 0.2)' : event.status === 'confirmed' ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(59, 130, 246, 0.2)'
                                                    }}
                                                />
                                                {event.totalPrice > 0 && (
                                                    <MuiTypography variant="caption" sx={{
                                                        color: 'var(--color-primary-600)',
                                                        fontWeight: 600
                                                    }}>
                                                        {formatCurrency(event.totalPrice, 'SY')}
                                                    </MuiTypography>
                                                )}
                                            </MuiBox>
                                        </MuiBox>

                                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                                            {event.client?.name && (
                                                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Users size={14} style={{ color: 'var(--color-text-secondary)' }} />
                                                    <MuiTypography variant="body2" sx={{
                                                        color: 'var(--color-text-secondary)',
                                                        fontWeight: 500
                                                    }}>
                                                        {event.client.name}
                                                    </MuiTypography>
                                                </MuiBox>
                                            )}
                                            {event.guestCount > 0 && (
                                                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Users2 size={14} style={{ color: 'var(--color-text-secondary)' }} />
                                                    <MuiTypography variant="body2" sx={{
                                                        color: 'var(--color-text-secondary)',
                                                        fontWeight: 500
                                                    }}>
                                                        {event.guestCount} ضيف
                                                    </MuiTypography>
                                                </MuiBox>
                                            )}
                                            {event.paidAmount > 0 && (
                                                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <DollarSign size={14} style={{ color: 'var(--color-text-secondary)' }} />
                                                    <MuiTypography variant="body2" sx={{
                                                        color: 'var(--color-text-secondary)',
                                                        fontWeight: 500
                                                    }}>
                                                        مدفوع: {formatCurrency(event.paidAmount, 'SY')}
                                                    </MuiTypography>
                                                </MuiBox>
                                            )}
                                        </MuiBox>
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
                                    لا توجد فعاليات حديثة
                                </MuiTypography>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-disabled)' }}>
                                    لم يتم تسجيل أي فعاليات حديثة حتى الآن
                                </MuiTypography>
                            </MuiBox>
                        )}
                    </MuiPaper>
                </MuiGrid>
            </MuiGrid>

            {/* Summary Cards Section */}
            <MuiGrid container spacing={3} sx={{ mt: 2 }}>
                {/* Events Summary */}
                <MuiGrid item xs={12} md={6} lg={4}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            background: 'var(--color-paper)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            height: '100%',
                            boxShadow: 'var(--shadow-lg)'
                        }}
                    >
                        <MuiBox sx={{
                            p: 3,
                            background: 'linear-gradient(135deg, var(--color-info-600), var(--color-info-800))',
                        }}>
                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <MuiBox sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '10px',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Calendar size={20} style={{ color: '#fff' }} />
                                </MuiBox>
                                <MuiTypography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
                                    ملخص الفعاليات
                                </MuiTypography>
                            </MuiBox>
                        </MuiBox>
                        <MuiBox sx={{ p: 3 }}>
                            <MuiGrid container spacing={2}>
                                <MuiGrid item xs={6}>
                                    <SummaryItem label="اليوم" value={stats.todayEvents} color="primary" />
                                </MuiGrid>
                                <MuiGrid item xs={6}>
                                    <SummaryItem label="هذا الأسبوع" value={stats.thisWeekEvents} color="info" />
                                </MuiGrid>
                                <MuiGrid item xs={6}>
                                    <SummaryItem label="هذا الشهر" value={stats.thisMonthEvents} color="success" />
                                </MuiGrid>
                                <MuiGrid item xs={6}>
                                    <SummaryItem label="قيد الانتظار" value={stats.pendingEvents} color="warning" />
                                </MuiGrid>
                                <MuiGrid item xs={6}>
                                    <SummaryItem label="مؤكدة" value={stats.confirmedEvents} color="success" />
                                </MuiGrid>
                                <MuiGrid item xs={6}>
                                    <SummaryItem label="مكتملة" value={stats.completedEvents} color="primary" />
                                </MuiGrid>
                            </MuiGrid>
                            {Object.keys(stats.eventsByType || {}).length > 0 && (
                                <>
                                    <MuiDivider sx={{ my: 2 }} />
                                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 1 }}>
                                        حسب النوع
                                    </MuiTypography>
                                    <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {Object.entries(stats.eventsByType || {}).map(([type, count]) => (
                                            <MuiChip
                                                key={type}
                                                label={`${type === 'wedding' ? 'زفاف' : type === 'graduation' ? 'تخرج' : type === 'birthday' ? 'عيد ميلاد' : type === 'other' ? 'أخرى' : type}: ${count}`}
                                                size="small"
                                                sx={{
                                                    backgroundColor: 'var(--color-info-50)',
                                                    color: 'var(--color-info-700)',
                                                    fontWeight: 600
                                                }}
                                            />
                                        ))}
                                    </MuiBox>
                                </>
                            )}
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>

                {/* Financial Summary */}
                <MuiGrid item xs={12} md={6} lg={4}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            background: 'var(--color-paper)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            height: '100%',
                            boxShadow: 'var(--shadow-lg)'
                        }}
                    >
                        <MuiBox sx={{
                            p: 3,
                            background: 'linear-gradient(135deg, var(--color-success-600), var(--color-success-800))',
                        }}>
                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <MuiBox sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '10px',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <DollarSign size={20} style={{ color: '#fff' }} />
                                </MuiBox>
                                <MuiTypography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
                                    الملخص المالي
                                </MuiTypography>
                            </MuiBox>
                        </MuiBox>
                        <MuiBox sx={{ p: 3 }}>
                            <MuiGrid container spacing={2}>
                                <MuiGrid item xs={12}>
                                    <SummaryItem
                                        label="إجمالي الإيرادات"
                                        value={formatCurrency(stats.totalRevenue, stats.currency)}
                                        color="primary"
                                        fullWidth
                                    />
                                </MuiGrid>
                                <MuiGrid item xs={6}>
                                    <SummaryItem label="إيرادات الشهر" value={formatCurrency(stats.monthRevenue, stats.currency)} color="success" />
                                </MuiGrid>
                                <MuiGrid item xs={6}>
                                    <SummaryItem label="المدفوع" value={formatCurrency(stats.totalPaid, stats.currency)} color="info" />
                                </MuiGrid>
                                <MuiGrid item xs={6}>
                                    <SummaryItem label="المتبقي" value={formatCurrency(stats.totalUnpaid, stats.currency)} color="warning" />
                                </MuiGrid>
                                <MuiGrid item xs={6}>
                                    <SummaryItem label="مكتمل" value={formatCurrency(stats.completedPayments, stats.currency)} color="success" />
                                </MuiGrid>
                            </MuiGrid>
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>

                {/* Invitations & Clients Summary */}
                <MuiGrid item xs={12} md={6} lg={4}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            background: 'var(--color-paper)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            height: '100%',
                            boxShadow: 'var(--shadow-lg)'
                        }}
                    >
                        <MuiBox sx={{
                            p: 3,
                            background: 'linear-gradient(135deg, var(--color-secondary-600), var(--color-secondary-800))',
                        }}>
                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <MuiBox sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '10px',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <FileText size={20} style={{ color: '#fff' }} />
                                </MuiBox>
                                <MuiTypography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
                                    الدعوات والعملاء
                                </MuiTypography>
                            </MuiBox>
                        </MuiBox>
                        <MuiBox sx={{ p: 3 }}>
                            <MuiTypography variant="subtitle2" sx={{ color: 'var(--color-text-primary)', fontWeight: 600, mb: 2 }}>
                                الدعوات
                            </MuiTypography>
                            <MuiGrid container spacing={2} sx={{ mb: 3 }}>
                                <MuiGrid item xs={6}>
                                    <SummaryItem label="إجمالي الدعوات" value={stats.totalInvitations} color="primary" />
                                </MuiGrid>
                                <MuiGrid item xs={6}>
                                    <SummaryItem label="المستخدمة" value={stats.usedInvitations} color="success" />
                                </MuiGrid>
                                <MuiGrid item xs={6}>
                                    <SummaryItem label="المعلقة" value={stats.pendingInvitations} color="warning" />
                                </MuiGrid>
                                <MuiGrid item xs={6}>
                                    <SummaryItem label="الحضور" value={stats.checkedInGuests} color="info" />
                                </MuiGrid>
                            </MuiGrid>
                            <MuiDivider sx={{ my: 2 }} />
                            <MuiTypography variant="subtitle2" sx={{ color: 'var(--color-text-primary)', fontWeight: 600, mb: 2 }}>
                                العملاء
                            </MuiTypography>
                            <MuiGrid container spacing={2}>
                                <MuiGrid item xs={6}>
                                    <SummaryItem label="إجمالي العملاء" value={stats.totalClients} color="secondary" />
                                </MuiGrid>
                                <MuiGrid item xs={6}>
                                    <SummaryItem label="النشطين" value={stats.activeClients} color="success" />
                                </MuiGrid>
                                <MuiGrid item xs={12}>
                                    <SummaryItem label="جدد هذا الشهر" value={stats.newClientsThisMonth} color="info" />
                                </MuiGrid>
                            </MuiGrid>
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>

                {/* Complaints & Staff Summary */}
                <MuiGrid item xs={12} md={6} lg={4}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            background: 'var(--color-paper)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            height: '100%',
                            boxShadow: 'var(--shadow-lg)'
                        }}
                    >
                        <MuiBox sx={{
                            p: 3,
                            background: 'linear-gradient(135deg, var(--color-warning-600), var(--color-warning-800))',
                        }}>
                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <MuiBox sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '10px',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <MessageSquare size={20} style={{ color: '#fff' }} />
                                </MuiBox>
                                <MuiTypography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
                                    الشكاوى والموظفين
                                </MuiTypography>
                            </MuiBox>
                        </MuiBox>
                        <MuiBox sx={{ p: 3 }}>
                            <MuiTypography variant="subtitle2" sx={{ color: 'var(--color-text-primary)', fontWeight: 600, mb: 2 }}>
                                الشكاوى
                            </MuiTypography>
                            <MuiGrid container spacing={2} sx={{ mb: 3 }}>
                                <MuiGrid item xs={6}>
                                    <SummaryItem label="إجمالي الشكاوى" value={stats.totalComplaints} color="warning" />
                                </MuiGrid>
                                <MuiGrid item xs={6}>
                                    <SummaryItem label="المفتوحة" value={stats.openComplaints} color="error" />
                                </MuiGrid>
                                <MuiGrid item xs={6}>
                                    <SummaryItem label="المحلولة" value={stats.resolvedComplaints} color="success" />
                                </MuiGrid>
                                <MuiGrid item xs={6}>
                                    <SummaryItem label="العاجلة" value={stats.urgentComplaints} color="error" />
                                </MuiGrid>
                            </MuiGrid>
                            <MuiDivider sx={{ my: 2 }} />
                            <MuiTypography variant="subtitle2" sx={{ color: 'var(--color-text-primary)', fontWeight: 600, mb: 2 }}>
                                الموظفين
                            </MuiTypography>
                            <MuiGrid container spacing={2}>
                                <MuiGrid item xs={6}>
                                    <SummaryItem label="إجمالي الموظفين" value={stats.totalStaff} color="secondary" />
                                </MuiGrid>
                                <MuiGrid item xs={6}>
                                    <SummaryItem label="النشطين" value={stats.activeStaff} color="success" />
                                </MuiGrid>
                            </MuiGrid>
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>

                {/* Upcoming Events */}
                <MuiGrid item xs={12} md={6} lg={8}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            background: 'var(--color-paper)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            height: '100%',
                            boxShadow: 'var(--shadow-lg)'
                        }}
                    >
                        <MuiBox sx={{
                            p: 3,
                            borderBottom: '1px solid var(--color-border)',
                        }}>
                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <MuiBox sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '12px',
                                    background: 'var(--color-success-50)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--color-success-600)'
                                }}>
                                    <Clock size={24} strokeWidth={2.5} />
                                </MuiBox>
                                <MuiBox>
                                    <MuiTypography variant="h6" sx={{
                                        fontWeight: 700,
                                        color: 'var(--color-text-primary)'
                                    }}>
                                        الفعاليات القادمة
                                    </MuiTypography>
                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                        {stats.upcomingEvents?.length || 0} فعاليات قادمة
                                    </MuiTypography>
                                </MuiBox>
                            </MuiBox>
                        </MuiBox>

                        {stats.upcomingEvents && stats.upcomingEvents.length > 0 ? (
                            <MuiBox sx={{ p: 3 }}>
                                <MuiGrid container spacing={2}>
                                    {stats.upcomingEvents.map((event, index) => (
                                        <MuiGrid item xs={12} sm={6} key={event._id || index}>
                                            <MuiBox sx={{
                                                p: 2,
                                                borderRadius: '12px',
                                                background: 'var(--color-surface)',
                                                border: '1px solid var(--color-border)',
                                            }}>
                                                <MuiTypography variant="subtitle2" sx={{
                                                    fontWeight: 700,
                                                    color: 'var(--color-text-primary)',
                                                    mb: 1
                                                }}>
                                                    {event.name || 'فعالية بدون اسم'}
                                                </MuiTypography>
                                                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                                    <MuiChip
                                                        label={event.type === 'graduation' ? 'تخرج' : event.type === 'wedding' ? 'زفاف' : event.type === 'birthday' ? 'عيد ميلاد' : event.type === 'other' ? 'أخرى' : event.type || 'فعالية'}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: 'var(--color-success-50)',
                                                            color: 'var(--color-success-700)',
                                                            fontWeight: 600,
                                                            fontSize: '0.75rem',
                                                            height: 24,
                                                            border: '1px solid var(--color-success-100)'
                                                        }}
                                                    />
                                                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                                        {event.date ? new Date(event.date).toLocaleDateString('ar-SA') : '-'}
                                                    </MuiTypography>
                                                </MuiBox>
                                                {event.client?.name && (
                                                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mt: 1 }}>
                                                        العميل: {event.client.name}
                                                    </MuiTypography>
                                                )}
                                            </MuiBox>
                                        </MuiGrid>
                                    ))}
                                </MuiGrid>
                            </MuiBox>
                        ) : (
                            <MuiBox sx={{ p: 6, textAlign: 'center' }}>
                                <Clock size={64} style={{
                                    color: 'var(--color-text-disabled)',
                                    opacity: 0.5,
                                    margin: '0 auto 1rem'
                                }} />
                                <MuiTypography variant="h6" sx={{
                                    color: 'var(--color-text-secondary)',
                                    mb: 2,
                                    fontWeight: 700
                                }}>
                                    لا توجد فعاليات قادمة
                                </MuiTypography>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-disabled)' }}>
                                    لم يتم تسجيل أي فعاليات قادمة
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

function SummaryItem({ label, value, color = 'primary', fullWidth = false }) {
    return (
        <MuiBox sx={{
            p: 1.5,
            borderRadius: '10px',
            background: `var(--color-${color}-50)`,
            border: `1px solid var(--color-${color}-100)`,
            textAlign: 'center',
            width: fullWidth ? '100%' : 'auto'
        }}>
            <MuiTypography variant="caption" sx={{
                color: `var(--color-${color}-600)`,
                display: 'block',
                mb: 0.5,
                fontWeight: 600
            }}>
                {label}
            </MuiTypography>
            <MuiTypography variant="h6" sx={{
                fontWeight: 700,
                color: `var(--color-${color}-700)`,
                fontSize: '1.1rem'
            }}>
                {value}
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
