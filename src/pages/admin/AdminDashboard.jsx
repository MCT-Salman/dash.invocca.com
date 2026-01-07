// src/pages/admin/AdminDashboard.jsx
/**
 * Admin Dashboard Page - Enhanced Design
 * لوحة تحكم الأدمن - تصميم محسّن ومتجاوب
 */
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import MuiBox from '@/components/ui/MuiBox'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiChip from '@/components/ui/MuiChip'
import MuiDivider from '@/components/ui/MuiDivider'
import MuiLinearProgress from '@/components/ui/MuiLinearProgress'
import { LoadingScreen, EmptyState, SEOHead } from '@/components/common'
import { QUERY_KEYS } from '@/config/constants'
import { getAdminDashboard } from '@/api/admin'
import { formatNumber } from '@/utils/helpers'
import { useAuth } from '@/hooks'
import {
    LayoutDashboard,
    Building2,
    Users,
    Calendar,
    TrendingUp,
    DollarSign,
    UserPlus,
    AlertCircle,
    CheckCircle,
    Clock,
    Mail,
    MessageSquare,
    TrendingDown,
    CreditCard,
    UserCheck
} from 'lucide-react'

/**
 * Stat Card Component
 */
function StatCard({ title, value, icon: Icon, trend, trendValue, color = 'var(--color-primary-500)' }) {
    return (
        <MuiPaper
            elevation={0}
            sx={{
                p: 3,
                height: '100%',
                background: 'var(--color-surface-dark)',
                border: '1px solid var(--color-border-glass)',
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                    borderColor: color,
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${color}, transparent)`,
                }
            }}
        >
            <MuiBox sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                <MuiBox>
                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 1, fontWeight: 500 }}>
                        {title}
                    </MuiTypography>
                    <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                        {formatNumber(value)}
                    </MuiTypography>
                </MuiBox>
                <MuiBox
                    sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid ${color}`,
                    }}
                >
                    <Icon size={28} style={{ color }} />
                </MuiBox>
            </MuiBox>
            {trend && (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp size={16} style={{ color: 'var(--color-success-500)' }} />
                    <MuiTypography variant="caption" sx={{ color: 'var(--color-success-500)', fontWeight: 600 }}>
                        {trendValue}
                    </MuiTypography>
                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                        من الشهر الماضي
                    </MuiTypography>
                </MuiBox>
            )}
        </MuiPaper>
    )
}

/**
 * Recent Activity Item
 */
function ActivityItem({ type, title, time, status }) {
    const statusColors = {
        success: { bg: 'rgba(22, 163, 74, 0.2)', color: 'var(--color-success-500)', label: 'مكتمل' },
        pending: { bg: 'rgba(217, 155, 61, 0.2)', color: 'var(--color-warning-500)', label: 'قيد الانتظار' },
        cancelled: { bg: 'rgba(220, 38, 38, 0.2)', color: 'var(--color-error-500)', label: 'ملغي' }
    }

    const config = statusColors[status] || statusColors.pending

    return (
        <MuiBox
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: '12px',
                transition: 'all 0.2s ease',
                '&:hover': {
                    background: 'rgba(255, 255, 255, 0.03)',
                }
            }}
        >
            <MuiBox
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: config.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {status === 'success' && <CheckCircle size={20} style={{ color: config.color }} />}
                {status === 'pending' && <Clock size={20} style={{ color: config.color }} />}
                {status === 'cancelled' && <AlertCircle size={20} style={{ color: config.color }} />}
                {(!status || (status !== 'success' && status !== 'pending' && status !== 'cancelled')) && <Clock size={20} style={{ color: config.color }} />}
            </MuiBox>
            <MuiBox sx={{ flex: 1 }}>
                <MuiTypography variant="body2" sx={{ fontWeight: 600, color: 'var(--color-text-primary-dark)', mb: 0.5 }}>
                    {title}
                </MuiTypography>
                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                    {time}
                </MuiTypography>
            </MuiBox>
            <MuiChip
                label={config.label}
                size="small"
                sx={{
                    background: config.bg,
                    color: config.color,
                    fontWeight: 600,
                    border: 'none',
                }}
            />
        </MuiBox>
    )
}

export default function AdminDashboard() {
    const { user } = useAuth()

    // Fetch dashboard data
    const { data, isLoading } = useQuery({
        queryKey: [QUERY_KEYS.ADMIN_DASHBOARD],
        queryFn: getAdminDashboard,
    })

    const stats = useMemo(() => {
        const dashboardData = data?.data || data || {}
        const summary = dashboardData.summary || {}

        // Map all API response data to stats structure
        return {
            // Halls
            totalHalls: summary.halls?.total || 0,
            activeHalls: summary.halls?.active || 0,
            inactiveHalls: summary.halls?.inactive || 0,
            
            // Users
            totalUsers: summary.users?.total || 0,
            activeUsers: summary.users?.active || 0,
            newUsersToday: summary.users?.newToday || 0,
            newUsersThisMonth: summary.users?.newThisMonth || 0,
            adminUsers: summary.users?.byRole?.admin || 0,
            managerUsers: summary.users?.byRole?.manager || 0,
            clientUsers: summary.users?.byRole?.client || 0,
            scannerUsers: summary.users?.byRole?.scanner || 0,
            
            // Events
            totalEvents: summary.events?.total || 0,
            upcomingEvents: summary.events?.upcoming || 0,
            todayEvents: summary.events?.today || 0,
            thisMonthEvents: summary.events?.thisMonth || 0,
            completedEvents: summary.events?.completed || 0,
            cancelledEvents: summary.events?.cancelled || 0,
            eventsByStatus: summary.events?.byStatus || {},
            eventsByType: summary.events?.byType || {},
            
            // Invitations
            totalInvitations: summary.invitations?.total || 0,
            usedInvitations: summary.invitations?.used || 0,
            pendingInvitations: summary.invitations?.pending || 0,
            todayInvitations: summary.invitations?.todayCreated || 0,
            invitationUsageRate: summary.invitations?.usageRate || '0.00',
            
            // Complaints
            totalComplaints: summary.complaints?.total || 0,
            openComplaints: summary.complaints?.open || 0,
            resolvedComplaints: summary.complaints?.resolved || 0,
            complaintsByStatus: summary.complaints?.byStatus || {},
            complaintsByPriority: summary.complaints?.byPriority || {},
            
            // Financial
            totalRevenue: summary.financial?.totalRevenue || 0,
            monthRevenue: summary.financial?.monthRevenue || 0,
            yearRevenue: summary.financial?.yearRevenue || 0,
            pendingPayments: summary.financial?.pendingPayments || 0,
            completedPayments: summary.financial?.completedPayments || 0,
            currency: summary.financial?.currency || 'SAR',
            
            // Top Performers
            topPerformers: dashboardData.topPerformers || {}
        }
    }, [data])

    const recentActivities = useMemo(() => {
        const dashboardData = data?.data || data || {}
        const recentActivity = dashboardData.recentActivity || {}
        
        // Combine events and complaints from recent activity
        const events = (recentActivity.events || []).map(event => ({
            ...event,
            type: 'event',
            title: event.name || event.title || 'فعالية جديدة',
            time: event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'الآن',
            status: event.status || 'pending',
            id: event._id || event.id
        }))
        
        const complaints = (recentActivity.complaints || []).map(complaint => ({
            ...complaint,
            type: 'complaint',
            title: complaint.title || 'شكوى جديدة',
            time: complaint.time || 'الآن',
            status: complaint.status || 'open',
            id: complaint._id || complaint.id
        }))
        
        return [...events, ...complaints]
    }, [data])

    if (isLoading) {
        return <LoadingScreen message="جاري تحميل لوحة التحكم..." fullScreen={false} />
    }

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
            <SEOHead pageKey="adminDashboard" />

            {/* Header Section */}
            <MuiBox
                sx={{
                    mb: 4,
                    p: 4,
                    borderRadius: '20px',
                    background: 'var(--color-surface-dark)',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border-glass)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '300px',
                        height: '300px',
                        background: 'radial-gradient(circle, rgba(216, 185, 138, 0.05) 0%, transparent 70%)',
                        borderRadius: '50%',
                    }
                }}
            >
                <MuiBox sx={{ position: 'relative', zIndex: 1 }}>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <MuiBox
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '14px',
                                background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid var(--color-primary-500)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                            }}
                        >
                            <LayoutDashboard size={28} className="text-white" />
                        </MuiBox>
                        <MuiBox>
                            <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700, mb: 0.5 }}>
                                مرحباً، {user?.name || 'المدير'}
                            </MuiTypography>
                            <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                                إليك نظرة عامة على نظام INVOCCA
                            </MuiTypography>
                        </MuiBox>
                    </MuiBox>
                </MuiBox>
            </MuiBox>

            {/* Stats Grid - Main Metrics */}
            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="إجمالي القاعات"
                        value={stats.totalHalls || 0}
                        icon={Building2}
                        trend
                        trendValue="+12%"
                        color="var(--color-primary-500)"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="القاعات النشطة"
                        value={stats.activeHalls || 0}
                        icon={CheckCircle}
                        trend
                        trendValue="+8%"
                        color="var(--color-success-500)"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="القاعات غير نشطة"
                        value={stats.inactiveHalls || 0}
                        icon={AlertCircle}
                        trendValue="-2%"
                        color="var(--color-warning-500)"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="إجمالي المستخدمين"
                        value={stats.totalUsers || 0}
                        icon={Users}
                        trend
                        trendValue="+8%"
                        color="var(--color-info-500)"
                    />
                </MuiGrid>
            </MuiGrid>

            {/* Stats Grid - User Details */}
            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="مستخدمين جدد اليوم"
                        value={stats.newUsersToday || 0}
                        icon={UserPlus}
                        color="var(--color-primary-500)"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="مستخدمين جدد هذا الشهر"
                        value={stats.newUsersThisMonth || 0}
                        icon={UserCheck}
                        trend
                        trendValue="+13%"
                        color="var(--color-success-500)"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="مديرين النظام"
                        value={stats.adminUsers || 0}
                        icon={Users}
                        color="var(--color-secondary-500)"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="المديرين"
                        value={stats.managerUsers || 0}
                        icon={Users}
                        color="var(--color-info-500)"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="العملاء"
                        value={stats.clientUsers || 0}
                        icon={Users}
                        color="var(--color-secondary-500)"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="الماسحات"
                        value={stats.scannerUsers || 0}
                        icon={Users}
                        color="var(--color-primary-500)"
                    />
                </MuiGrid>
            </MuiGrid>

            {/* Stats Grid - Events & Invitations */}
            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="إجمالي الفعاليات"
                        value={stats.totalEvents || 0}
                        icon={Calendar}
                        color="var(--color-primary-500)"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="فعاليات قادمة"
                        value={stats.upcomingEvents || 0}
                        icon={Calendar}
                        color="var(--color-secondary-500)"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="فعاليات اليوم"
                        value={stats.todayEvents || 0}
                        icon={Calendar}
                        color="var(--color-warning-500)"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="فعاليات مكتملة"
                        value={stats.completedEvents || 0}
                        icon={CheckCircle}
                        color="var(--color-success-500)"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="فعاليات هذا الشهر"
                        value={stats.thisMonthEvents || 0}
                        icon={Calendar}
                        color="var(--color-info-500)"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="فعاليات ملغاة"
                        value={stats.cancelledEvents || 0}
                        icon={AlertCircle}
                        color="var(--color-error-500)"
                    />
                </MuiGrid>
            </MuiGrid>

            {/* Stats Grid - Invitations */}
            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="إجمالي الدعوات"
                        value={stats.totalInvitations || 0}
                        icon={Mail}
                        color="var(--color-primary-500)"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="دعوات مستخدمة"
                        value={stats.usedInvitations || 0}
                        icon={CheckCircle}
                        color="var(--color-success-500)"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="دعوات معلقة"
                        value={stats.pendingInvitations || 0}
                        icon={Clock}
                        color="var(--color-warning-500)"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="دعوات اليوم"
                        value={stats.todayInvitations || 0}
                        icon={Mail}
                        color="var(--color-info-500)"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            p: 3,
                            height: '100%',
                            background: 'var(--color-surface-dark)',
                            border: '1px solid var(--color-border-glass)',
                            borderRadius: '16px',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                                borderColor: 'var(--color-primary-500)',
                            },
                        }}
                    >
                        <MuiBox sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                            <MuiBox>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 1, fontWeight: 500 }}>
                                    معدل استخدام الدعوات
                                </MuiTypography>
                                <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                                    {stats.invitationUsageRate}%
                                </MuiTypography>
                            </MuiBox>
                            <MuiBox
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: '12px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid var(--color-primary-500)',
                                }}
                            >
                                <TrendingUp size={28} style={{ color: 'var(--color-primary-500)' }} />
                            </MuiBox>
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>
            </MuiGrid>

            {/* Stats Grid - Complaints */}
            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="إجمالي الشكاوى"
                        value={stats.totalComplaints || 0}
                        icon={MessageSquare}
                        color="var(--color-error-500)"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="شكاوى مفتوحة"
                        value={stats.openComplaints || 0}
                        icon={AlertCircle}
                        color="var(--color-warning-500)"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="شكاوى مغلقة"
                        value={stats.resolvedComplaints || 0}
                        icon={CheckCircle}
                        color="var(--color-success-500)"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            p: 3,
                            height: '100%',
                            background: 'var(--color-surface-dark)',
                            border: '1px solid var(--color-border-glass)',
                            borderRadius: '16px',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                                borderColor: 'var(--color-success-500)',
                            },
                        }}
                    >
                        <MuiBox sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                            <MuiBox>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 1, fontWeight: 500 }}>
                                    الإيرادات الشهرية
                                </MuiTypography>
                                <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                                    {formatNumber(stats.monthRevenue || 0)} {stats.currency || 'ر.س'}
                                </MuiTypography>
                            </MuiBox>
                            <MuiBox
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: '12px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid var(--color-success-500)',
                                }}
                            >
                                <DollarSign size={28} style={{ color: 'var(--color-success-500)' }} />
                            </MuiBox>
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            p: 3,
                            height: '100%',
                            background: 'var(--color-surface-dark)',
                            border: '1px solid var(--color-border-glass)',
                            borderRadius: '16px',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                                borderColor: 'var(--color-primary-500)',
                            },
                        }}
                    >
                        <MuiBox sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                            <MuiBox>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 1, fontWeight: 500 }}>
                                    الإيرادات السنوية
                                </MuiTypography>
                                <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                                    {formatNumber(stats.yearRevenue || 0)} {stats.currency || 'ر.س'}
                                </MuiTypography>
                            </MuiBox>
                            <MuiBox
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: '12px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid var(--color-primary-500)',
                                }}
                            >
                                <TrendingUp size={28} style={{ color: 'var(--color-primary-500)' }} />
                            </MuiBox>
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            p: 3,
                            height: '100%',
                            background: 'var(--color-surface-dark)',
                            border: '1px solid var(--color-border-glass)',
                            borderRadius: '16px',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                                borderColor: 'var(--color-warning-500)',
                            },
                        }}
                    >
                        <MuiBox sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                            <MuiBox>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 1, fontWeight: 500 }}>
                                    مدفوعات معلقة
                                </MuiTypography>
                                <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                                    {formatNumber(stats.pendingPayments || 0)} {stats.currency || 'ر.س'}
                                </MuiTypography>
                            </MuiBox>
                            <MuiBox
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: '12px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid var(--color-warning-500)',
                                }}
                            >
                                <CreditCard size={28} style={{ color: 'var(--color-warning-500)' }} />
                            </MuiBox>
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            p: 3,
                            height: '100%',
                            background: 'var(--color-surface-dark)',
                            border: '1px solid var(--color-border-glass)',
                            borderRadius: '16px',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                                borderColor: 'var(--color-success-500)',
                            },
                        }}
                    >
                        <MuiBox sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                            <MuiBox>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 1, fontWeight: 500 }}>
                                    مدفوعات مكتملة
                                </MuiTypography>
                                <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                                    {formatNumber(stats.completedPayments || 0)} {stats.currency || 'ر.س'}
                                </MuiTypography>
                            </MuiBox>
                            <MuiBox
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: '12px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid var(--color-success-500)',
                                }}
                            >
                                <CheckCircle size={28} style={{ color: 'var(--color-success-500)' }} />
                            </MuiBox>
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>
            </MuiGrid>

            <MuiGrid container spacing={3}>
                {/* Recent Activities */}
                <MuiGrid item xs={12} md={8}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: '16px',
                            border: '1px solid var(--color-border-glass)',
                            height: '100%',
                            background: 'var(--color-surface-dark)',
                        }}
                    >
                        <MuiTypography variant="h6" sx={{ mb: 3, fontWeight: 700, color: 'var(--color-text-primary-dark)' }}>
                            النشاطات الأخيرة
                        </MuiTypography>
                        <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {recentActivities.length > 0 ? (
                                recentActivities.map((activity, index) => (
                                    <ActivityItem
                                        key={activity.id || index}
                                        type={activity.type}
                                        title={activity.title}
                                        time={activity.time}
                                        status={activity.status}
                                    />
                                ))
                            ) : (
                                <EmptyState
                                    title="لا توجد نشاطات حديثة"
                                    icon={Clock}
                                    showPaper={false}
                                />
                            )}
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>

                {/* Top Performers */}
                {stats.topPerformers?.halls && stats.topPerformers.halls.length > 0 && (
                    <MuiGrid item xs={12} md={4}>
                        <MuiPaper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: '16px',
                                border: '1px solid var(--color-border-glass)',
                                height: '100%',
                                background: 'var(--color-surface-dark)',
                            }}
                        >
                            <MuiTypography variant="h6" sx={{ mb: 3, fontWeight: 700, color: 'var(--color-text-primary-dark)' }}>
                                أفضل القاعات
                            </MuiTypography>
                            <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {stats.topPerformers.halls.map((hall, index) => (
                                    <MuiBox
                                        key={hall._id || index}
                                        sx={{
                                            p: 2,
                                            borderRadius: '12px',
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            border: '1px solid var(--color-border-glass)',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                borderColor: 'var(--color-primary-500)',
                                            }
                                        }}
                                    >
                                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Building2 size={16} style={{ color: 'var(--color-primary-500)' }} />
                                            <MuiTypography variant="subtitle2" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                                                {hall.hallName || '—'}
                                            </MuiTypography>
                                        </MuiBox>
                                        <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                            <MuiBox>
                                                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block' }}>
                                                    عدد الفعاليات
                                                </MuiTypography>
                                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                                                    {hall.eventCount || 0}
                                                </MuiTypography>
                                            </MuiBox>
                                            <MuiBox>
                                                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block' }}>
                                                    الإيرادات
                                                </MuiTypography>
                                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                                                    {formatNumber(hall.totalRevenue || 0)} {stats.currency || 'ر.س'}
                                                </MuiTypography>
                                            </MuiBox>
                                        </MuiBox>
                                    </MuiBox>
                                ))}
                            </MuiBox>
                        </MuiPaper>
                    </MuiGrid>
                )}
            </MuiGrid>
        </MuiBox>
    )
}