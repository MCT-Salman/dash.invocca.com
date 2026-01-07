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
        color: '#D8B98A',
        gradient: 'linear-gradient(135deg, #D8B98A 0%, #c4a578 100%)'
    },
    {
        key: 'todayBookings',
        title: 'حجوزات اليوم',
        icon: Clock,
        formatter: formatNumber,
        color: '#FFE36C',
        gradient: 'linear-gradient(135deg, #FFE36C 0%, #ffd93d 100%)'
    },
    {
        key: 'activeBookings',
        title: 'الحجوزات النشطة',
        icon: CheckCircle,
        formatter: formatNumber,
        color: '#4ade80',
        gradient: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'
    },
    {
        key: 'monthlyRevenue',
        title: 'الإيرادات الشهرية',
        icon: DollarSign,
        formatter: formatCurrency,
        color: '#1A1A1A',
        gradient: 'linear-gradient(135deg, #1A1A1A 0%, #0a0a0a 100%)'
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

    // If totalEvents is missing or 0, calculate it from events
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

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
            <SEOHead pageKey="managerDashboard" />

            {/* Header Section - Premium Welcome Card */}
            <MuiBox
                sx={{
                    mb: 5,
                    p: { xs: 3, sm: 4.5, md: 5 },
                    borderRadius: '24px',
                    background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid rgba(216, 185, 138, 0.2)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(216, 185, 138, 0.1)',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '-50%',
                        right: '-20%',
                        width: '500px',
                        height: '500px',
                        background: 'radial-gradient(circle, rgba(216, 185, 138, 0.12) 0%, transparent 70%)',
                        borderRadius: '50%',
                        animation: 'pulse 4s ease-in-out infinite',
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '-30%',
                        left: '-10%',
                        width: '400px',
                        height: '400px',
                        background: 'radial-gradient(circle, rgba(216, 185, 138, 0.08) 0%, transparent 70%)',
                        borderRadius: '50%',
                        animation: 'pulse 5s ease-in-out infinite',
                    }
                }}
            >
                <MuiBox sx={{ position: 'relative', zIndex: 1 }}>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                        <MuiBox
                            sx={{
                                width: { xs: 64, sm: 72 },
                                height: { xs: 64, sm: 72 },
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid var(--color-primary-400)',
                                boxShadow: '0 10px 30px rgba(216, 185, 138, 0.3), 0 0 20px rgba(216, 185, 138, 0.2)',
                                position: 'relative',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    inset: -2,
                                    borderRadius: '20px',
                                    padding: '2px',
                                    background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-300))',
                                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                    WebkitMaskComposite: 'xor',
                                    maskComposite: 'exclude',
                                    opacity: 0.5,
                                }
                            }}
                        >
                            <LayoutDashboard size={36} style={{ color: '#fff', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }} />
                        </MuiBox>
                        <MuiBox sx={{ flex: 1 }}>
                            <MuiTypography 
                                variant="h4" 
                                sx={{ 
                                    color: 'var(--color-text-primary-dark)', 
                                    fontWeight: 800, 
                                    mb: 1,
                                    fontSize: { xs: '1.5rem', sm: '2rem' },
                                    background: 'linear-gradient(135deg, var(--color-text-primary-dark), var(--color-primary-500))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                مرحباً، {user?.name || 'المدير'}
                            </MuiTypography>
                            <MuiTypography 
                                variant="body1" 
                                sx={{ 
                                    color: 'var(--color-primary-400)',
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                    fontWeight: 500,
                                    letterSpacing: '0.3px'
                                }}
                            >
                                نظرة شاملة على قاعتك وفعالياتك • {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </MuiTypography>
                        </MuiBox>
                    </MuiBox>
                </MuiBox>
            </MuiBox>

            {/* Stats Grid */}
            <MuiGrid
                container
                spacing={{ xs: 2, sm: 2, md: 3 }}
                sx={{ mb: 4.5 }}
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
                                p: 3.5,
                                height: '100%',
                                background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                border: '1px solid rgba(216, 185, 138, 0.15)',
                                borderRadius: '20px',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'pointer',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    background: `linear-gradient(90deg, ${config.color} 0%, ${config.color}80 50%, transparent 100%)`,
                                    opacity: 0.6,
                                },
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '-50%',
                                    right: '-50%',
                                    width: '200%',
                                    height: '200%',
                                    background: `radial-gradient(circle, ${config.color}08 0%, transparent 70%)`,
                                    opacity: 0,
                                    transition: 'opacity 0.4s ease',
                                },
                                '&:hover': {
                                    transform: 'translateY(-8px) scale(1.02)',
                                    boxShadow: `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px ${config.color}20`,
                                    borderColor: `${config.color}60`,
                                    '&::after': {
                                        opacity: 1,
                                    },
                                    '& .stat-icon': {
                                        transform: 'scale(1.1) rotate(5deg)',
                                        background: config.gradient,
                                    }
                                }
                            }}
                        >
                            <MuiBox sx={{ position: 'relative', zIndex: 1 }}>
                                <MuiBox sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5 }}>
                                    <MuiBox sx={{ flex: 1 }}>
                                        <MuiTypography 
                                            variant="body2" 
                                            sx={{ 
                                                color: 'var(--color-text-secondary)', 
                                                mb: 1.5, 
                                                fontWeight: 500,
                                                fontSize: '0.875rem',
                                                letterSpacing: '0.3px'
                                            }}
                                        >
                                            {config.title}
                                        </MuiTypography>
                                        <MuiTypography 
                                            variant="h4" 
                                            sx={{ 
                                                color: 'var(--color-text-primary-dark)', 
                                                fontWeight: 800,
                                                fontSize: '2rem',
                                                background: `linear-gradient(135deg, var(--color-text-primary-dark), ${config.color})`,
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                            }}
                                        >
                                            {config.formatter(stats[config.key] || 0)}
                                        </MuiTypography>
                                    </MuiBox>
                                    <MuiBox
                                        className="stat-icon"
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: '16px',
                                            background: `linear-gradient(135deg, ${config.color}20, ${config.color}10)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: `2px solid ${config.color}30`,
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            boxShadow: `0 4px 12px ${config.color}15`,
                                        }}
                                    >
                                        <config.icon size={32} style={{ color: config.color, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} strokeWidth={2.5} />
                                    </MuiBox>
                                </MuiBox>

                                {/* Trend Indicator */}
                                {stats[`${config.key}Trend`] && (
                                    <MuiBox 
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 1.5,
                                            position: 'relative',
                                            zIndex: 1,
                                            mt: 1
                                        }}
                                    >
                                        <MuiBox
                                            sx={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: '8px',
                                                background: stats[`${config.key}Trend`] > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(220, 38, 38, 0.15)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {stats[`${config.key}Trend`] > 0 ? (
                                                <ArrowUpRight size={14} style={{ color: '#22c55e' }} />
                                            ) : (
                                                <ArrowDownRight size={14} style={{ color: '#dc2626' }} />
                                            )}
                                        </MuiBox>
                                        <MuiTypography
                                            variant="caption"
                                            sx={{ 
                                                fontWeight: 700,
                                                fontSize: '0.75rem',
                                                color: stats[`${config.key}Trend`] > 0 ? '#22c55e' : '#dc2626'
                                            }}
                                        >
                                            {Math.abs(stats[`${config.key}Trend`] || 0)}%
                                        </MuiTypography>
                                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.7rem' }}>
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
                                background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                border: '1px solid rgba(216, 185, 138, 0.15)',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                height: '100%',
                                position: 'relative',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: '200px',
                                    height: '200px',
                                    background: 'radial-gradient(circle, rgba(216, 185, 138, 0.08) 0%, transparent 70%)',
                                    borderRadius: '50%',
                                }
                            }}
                        >
                            {/* Header */}
                            <MuiBox sx={{ 
                                p: 3, 
                                background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
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
                                        معلومات القاعة
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
                                        اسم القاعة
                                    </MuiTypography>
                                    <MuiTypography variant="h6" sx={{ 
                                        fontWeight: 700, 
                                        color: 'var(--color-text-primary-dark)' 
                                    }}>
                                        {stats.hallInfo.name || '-'}
                                    </MuiTypography>
                                </MuiBox>

                                <MuiDivider sx={{ borderColor: 'var(--color-border-glass)', mb: 3 }} />

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
                                        color: 'var(--color-text-primary-dark)' 
                                    }}>
                                        {stats.hallInfo.location || '-'}
                                    </MuiTypography>
                                </MuiBox>

                                <MuiDivider sx={{ borderColor: 'var(--color-border-glass)', mb: 3 }} />

                                <MuiBox sx={{ display: 'flex', gap: 3 }}>
                                    <MuiBox sx={{ 
                                        flex: 1,
                                        p: 3, 
                                        borderRadius: '16px', 
                                        background: 'rgba(216, 185, 138, 0.1)',
                                        border: '1px solid rgba(216, 185, 138, 0.2)',
                                        textAlign: 'center'
                                    }}>
                                        <MuiTypography variant="caption" sx={{ 
                                            color: 'var(--color-primary-500)', 
                                            display: 'block',
                                            mb: 1,
                                            fontWeight: 600
                                        }}>
                                            الطاولات
                                        </MuiTypography>
                                        <MuiTypography variant="h4" sx={{ 
                                            fontWeight: 700, 
                                            color: 'var(--color-primary-500)' 
                                        }}>
                                            {stats.hallInfo.tables || 0}
                                        </MuiTypography>
                                    </MuiBox>

                                    <MuiBox sx={{ 
                                        flex: 1,
                                        p: 3, 
                                        borderRadius: '16px', 
                                        background: 'rgba(255, 227, 108, 0.1)',
                                        border: '1px solid rgba(255, 227, 108, 0.2)',
                                        textAlign: 'center'
                                    }}>
                                        <MuiTypography variant="caption" sx={{ 
                                            color: '#FFE36C', 
                                            display: 'block',
                                            mb: 1,
                                            fontWeight: 600
                                        }}>
                                            الكراسي
                                        </MuiTypography>
                                        <MuiTypography variant="h4" sx={{ 
                                            fontWeight: 700, 
                                            color: '#FFE36C' 
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
                            background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(216, 185, 138, 0.15)',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            height: '100%',
                            position: 'relative',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '200px',
                                height: '200px',
                                background: 'radial-gradient(circle, rgba(255, 227, 108, 0.05) 0%, transparent 70%)',
                                borderRadius: '50%',
                            }
                        }}
                    >
                        {/* Header */}
                        <MuiBox sx={{ 
                            p: 3, 
                            background: 'linear-gradient(135deg, rgba(216, 185, 138, 0.1), rgba(255, 227, 108, 0.05))',
                            borderBottom: '1px solid var(--color-border-glass)',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <MuiBox sx={{ 
                                        width: 48, 
                                        height: 48, 
                                        borderRadius: '12px', 
                                        background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 8px 16px rgba(216, 185, 138, 0.3)'
                                    }}>
                                        <Calendar size={24} style={{ color: '#fff' }} strokeWidth={2.5} />
                                    </MuiBox>
                                    <MuiBox>
                                        <MuiTypography variant="h6" sx={{ 
                                            fontWeight: 700, 
                                            color: 'var(--color-text-primary-dark)' 
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
                                            borderBottom: '1px solid var(--color-border-glass)',
                                            '&:hover': {
                                                background: 'rgba(216, 185, 138, 0.05)'
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
                                                    color: 'var(--color-text-primary-dark)', 
                                                    mb: 1,
                                                    transition: 'color 0.3s ease',
                                                    '&:hover': {
                                                        color: 'var(--color-primary-500)'
                                                    }
                                                }}>
                                                    {booking.clientName}
                                                </MuiTypography>
                                                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                                    <MuiChip
                                                        label={typeof booking.eventType === 'object' ? (booking.eventType.label || booking.eventType.name || String(booking.eventType)) : (booking.eventType || 'فعالية')}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: 'rgba(216, 185, 138, 0.1)',
                                                            color: 'var(--color-primary-500)',
                                                            fontWeight: 600,
                                                            fontSize: '0.75rem',
                                                            height: 24,
                                                            border: '1px solid rgba(216, 185, 138, 0.2)'
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
