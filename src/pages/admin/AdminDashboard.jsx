// src/pages/admin/AdminDashboard.jsx
/**
 * Admin Dashboard Page
 * Dashboard for the admin with system overview
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
import { getAdminDashboard } from '@/api/admin'
import { formatNumber, formatCurrency } from '@/utils/helpers'
import {
    LayoutDashboard,
    Users,
    Building2,
    Calendar,
    DollarSign,
    TrendingUp,
    Activity,
    UserPlus,
    Star,
    CheckCircle,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    Settings,
    FileText,
    BarChart3,
    PieChart as PieChartIcon
} from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    Legend
} from 'recharts'

const roleLabels = {
    admin: 'مدير',
    manager: 'مدير صالة',
    client: 'عميل',
    scanner: 'ماسح',
}

const CHART_COLORS = ['#D8B98A', '#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899']

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <MuiBox sx={{
                background: 'var(--color-paper)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                p: 1.5,
                boxShadow: 'var(--shadow-lg)',
                direction: 'rtl'
            }}>
                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', mb: 0.5, display: 'block' }}>
                    {label}
                </MuiTypography>
                {payload.map((entry, index) => (
                    <MuiTypography key={index} variant="body2" sx={{ color: entry.color, fontWeight: 600 }}>
                        {entry.name}: {typeof entry.value === 'number' && entry.name?.includes('إيرادات') ? formatCurrency(entry.value) : entry.value}
                    </MuiTypography>
                ))}
            </MuiBox>
        )
    }
    return null
}

const statsConfig = [
    {
        key: 'totalUsers',
        title: 'إجمالي المستخدمين',
        icon: Users,
        formatter: formatNumber,
        color: 'primary',
    },
    {
        key: 'totalHalls',
        title: 'إجمالي القاعات',
        icon: Building2,
        formatter: formatNumber,
        color: 'warning',
    },
    {
        key: 'totalEvents',
        title: 'إجمالي الفعاليات',
        icon: Calendar,
        formatter: formatNumber,
        color: 'info',
    },
    {
        key: 'totalRevenue',
        title: 'إجمالي الإيرادات',
        icon: DollarSign,
        formatter: (value) => formatCurrency(value, 'SY'),
        color: 'success',
    },
    {
        key: 'totalInvitations',
        title: 'إجمالي الدعوات',
        icon: FileText,
        formatter: formatNumber,
        color: 'secondary',
    },
    {
        key: 'completedPayments',
        title: 'المدفوعات المكتملة',
        icon: CheckCircle,
        formatter: formatNumber,
        color: 'success',
    },
]

/**
 * Admin Dashboard Content
 */
function AdminDashboardContent() {
    // Hooks must be called before any early returns
    const { user } = useAuth()

    // Fetch dashboard data
    const { data, isLoading, error } = useQuery({
        queryKey: [QUERY_KEYS.ADMIN_DASHBOARD],
        queryFn: getAdminDashboard,
    })

    // Normalize dashboard data
    const stats = useMemo(() => {
        if (!data?.data) return {}
        
        const { summary, recentActivity, topPerformers } = data.data
        
        return {
            totalUsers: summary?.users?.total || 0,
            totalHalls: summary?.halls?.total || 0,
            totalEvents: summary?.events?.total || 0,
            totalRevenue: summary?.financial?.totalRevenue || 0,
            totalInvitations: summary?.invitations?.total || 0,
            completedPayments: summary?.financial?.completedPayments || 0,
            recentEvents: recentActivity?.events || [],
            recentComplaints: recentActivity?.complaints || [],
            topHalls: topPerformers?.halls || [],
            summary: summary || {},
        }
    }, [data])

    if (isLoading) {
        return <LoadingScreen message="جاري تحميل بيانات لوحة التحكم..." fullScreen={false} />
    }

    if (error) {
        return (
            <EmptyState
                title="خطأ في تحميل لوحة التحكم"
                description={error.message || 'فشل في تحميل بيانات لوحة التحكم'}
                icon={AlertCircle}
                showPaper
            />
        )
    }

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-bg)' }}>
            <SEOHead pageKey="adminDashboard" />

            {/* Header Section */}
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
                                نظرة عامة على النظام ولوحة إدارة
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
                        md={4}
                        lg={2}
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
                                    <MuiBox sx={{ height: 32, opacity: 0.5, display: 'flex', alignItems: 'center' }}>
                                        <Activity size={14} style={{ marginRight: 8 }} color="var(--color-text-disabled)" />
                                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-disabled)' }}>
                                            حالة النظام نشطة
                                        </MuiTypography>
                                    </MuiBox>
                                </MuiBox>
                            </MuiBox>
                        </MuiPaper>
                    </MuiGrid>
                ))}
            </MuiGrid>

            {/* Recent Activity */}
            <MuiGrid
                container
                spacing={{ xs: 2, sm: 2, md: 3 }}
            >
                {/* Recent Users */}
                <MuiGrid item xs={12} md={6}>
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
                                        <Users size={24} strokeWidth={2.5} />
                                    </MuiBox>
                                    <MuiBox>
                                        <MuiTypography variant="h6" sx={{
                                            fontWeight: 700,
                                            color: 'var(--color-text-primary)'
                                        }}>
                                            نظرة عامة على النظام
                                        </MuiTypography>
                                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                            المستخدمون حسب الدور والنشاط
                                        </MuiTypography>
                                    </MuiBox>
                                </MuiBox>
                            </MuiBox>
                        </MuiBox>

                        {/* Content - User Statistics */}
                        <MuiBox sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                            <MuiTypography variant="subtitle2" sx={{
                                color: 'var(--color-text-primary)',
                                fontWeight: 600,
                                mb: 2
                            }}>
                                المستخدمون حسب الدور
                            </MuiTypography>
                            <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                                {Object.entries(stats.summary?.users?.byRole || {}).map(([role, count]) => (
                                    <MuiBox
                                        key={role}
                                        sx={{
                                            p: 2,
                                            borderRadius: '12px',
                                            background: 'var(--color-primary-50)',
                                            border: '1px solid var(--color-primary-100)',
                                            textAlign: 'center',
                                            minWidth: 80
                                        }}
                                    >
                                        <MuiTypography variant="h6" sx={{
                                            color: 'var(--color-primary-700)',
                                            fontWeight: 700
                                        }}>
                                            {count}
                                        </MuiTypography>
                                        <MuiTypography variant="caption" sx={{
                                            color: 'var(--color-primary-600)',
                                            fontWeight: 500,
                                            textTransform: 'capitalize'
                                        }}>
                                            {role.split(',').map(r => roleLabels[r.trim()] || r.trim()).join('، ')}
                                        </MuiTypography>
                                    </MuiBox>
                                ))}
                            </MuiBox>

                            <MuiDivider sx={{ mb: 3 }} />

                            <MuiTypography variant="subtitle2" sx={{
                                color: 'var(--color-text-primary)',
                                fontWeight: 600,
                                mb: 2
                            }}>
                                النشاط الأخير
                            </MuiTypography>
                            <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <MuiBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                        الجدد اليوم
                                    </MuiTypography>
                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                        {stats.summary?.users?.newToday || 0}
                                    </MuiTypography>
                                </MuiBox>
                                <MuiBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                        الجدد هذا الشهر
                                    </MuiTypography>
                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                        {stats.summary?.users?.newThisMonth || 0}
                                    </MuiTypography>
                                </MuiBox>
                            </MuiBox>
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>

                {/* Recent Events */}
                <MuiGrid item xs={12} md={6}>
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
                                            آخر {stats.recentEvents?.length || 0} فعالية
                                        </MuiTypography>
                                    </MuiBox>
                                </MuiBox>
                            </MuiBox>
                        </MuiBox>

                        {/* Content */}
                        {stats.recentEvents && stats.recentEvents.length > 0 ? (
                            <MuiBox sx={{ position: 'relative', zIndex: 1 }}>
                                {stats.recentEvents.slice(0, 5).map((event, index) => (
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
                                                    mb: 1
                                                }}>
                                                    {event.name || 'فعالية بدون اسم'}
                                                </MuiTypography>
                                                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                                                    <MuiChip
                                                        label={event.type === 'graduation' ? 'تخرج' : event.type === 'wedding' ? 'زفاف' : event.type === 'birthday' ? 'عيد ميلاد' : event.type || 'فعالية'}
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
                                                        {new Date(event.date).toLocaleDateString('ar-SA')}
                                                    </MuiTypography>
                                                </MuiBox>
                                                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                                    {event.hall?.name && (
                                                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                                            القاعة: {event.hall.name}
                                                        </MuiTypography>
                                                    )}
                                                    {event.client?.name && (
                                                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                                            العميل: {event.client.name}
                                                        </MuiTypography>
                                                    )}
                                                    {event.guestCount && (
                                                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                                            الضيوف: {event.guestCount}
                                                        </MuiTypography>
                                                    )}
                                                </MuiBox>
                                            </MuiBox>

                                            <MuiBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                                                <MuiChip
                                                    label={event.status === 'pending' ? 'قيد الانتظار' : event.status === 'confirmed' ? 'مؤكد' : event.status === 'completed' ? 'مكتمل' : event.status || 'نشط'}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: event.status === 'pending' ? 'rgba(216, 185, 138, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                                        color: event.status === 'pending' ? 'var(--color-primary-500)' : '#22c55e',
                                                        fontWeight: 700,
                                                        fontSize: '0.75rem',
                                                        height: 28,
                                                        borderRadius: '8px',
                                                        border: event.status === 'pending' ? '1px solid rgba(216, 185, 138, 0.2)' : '1px solid rgba(34, 197, 94, 0.2)'
                                                    }}
                                                />
                                                {event.totalPrice && (
                                                    <MuiTypography variant="caption" sx={{ 
                                                        color: 'var(--color-primary-600)',
                                                        fontWeight: 600 
                                                    }}>
                                                        {formatCurrency(event.totalPrice, 'SY')}
                                                    </MuiTypography>
                                                )}
                                            </MuiBox>
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
                                    لم يتم إنشاء فعاليات حديثة
                                </MuiTypography>
                            </MuiBox>
                        )}
                    </MuiPaper>
                </MuiGrid>
            </MuiGrid>

            {/* Charts Section */}
            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                {/* Revenue by Hall - Bar Chart */}
                {stats.topHalls && stats.topHalls.length > 0 && (
                    <MuiGrid item xs={12} md={6}>
                        <MuiPaper
                            elevation={0}
                            sx={{
                                background: 'var(--color-paper)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                boxShadow: 'var(--shadow-lg)'
                            }}
                        >
                            <MuiBox sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid var(--color-border)' }}>
                                <MuiBox sx={{
                                    width: 40, height: 40, borderRadius: '10px',
                                    background: 'var(--color-primary-50)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--color-primary-600)'
                                }}>
                                    <BarChart3 size={20} />
                                </MuiBox>
                                <MuiBox>
                                    <MuiTypography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '1rem' }}>
                                        إيرادات القاعات
                                    </MuiTypography>
                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                        مقارنة الإيرادات بين القاعات
                                    </MuiTypography>
                                </MuiBox>
                            </MuiBox>
                            <MuiBox sx={{ p: 3, height: 300, direction: 'ltr' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.topHalls.map(h => ({
                                        name: h.hallName || 'قاعة',
                                        إيرادات: h.totalRevenue || 0,
                                        فعاليات: h.eventCount || 0
                                    }))} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                        <XAxis dataKey="name" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                                        <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="إيرادات" fill="#D8B98A" radius={[6, 6, 0, 0]} />
                                        <Bar dataKey="فعاليات" fill="#22c55e" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </MuiBox>
                        </MuiPaper>
                    </MuiGrid>
                )}

                {/* Users by Role - Pie Chart */}
                {stats.summary?.users?.byRole && Object.keys(stats.summary.users.byRole).length > 0 && (
                    <MuiGrid item xs={12} md={6}>
                        <MuiPaper
                            elevation={0}
                            sx={{
                                background: 'var(--color-paper)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                boxShadow: 'var(--shadow-lg)'
                            }}
                        >
                            <MuiBox sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid var(--color-border)' }}>
                                <MuiBox sx={{
                                    width: 40, height: 40, borderRadius: '10px',
                                    background: 'var(--color-success-50)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--color-success-600)'
                                }}>
                                    <PieChartIcon size={20} />
                                </MuiBox>
                                <MuiBox>
                                    <MuiTypography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '1rem' }}>
                                        توزيع المستخدمين
                                    </MuiTypography>
                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                        نسبة المستخدمين حسب الدور
                                    </MuiTypography>
                                </MuiBox>
                            </MuiBox>
                            <MuiBox sx={{ p: 3, height: 300, direction: 'ltr' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={Object.entries(stats.summary.users.byRole).map(([role, count], i) => ({
                                                name: role.split(',').map(r => roleLabels[r.trim()] || r.trim()).join('، '),
                                                value: count
                                            }))}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            innerRadius={60}
                                            paddingAngle={3}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {Object.entries(stats.summary.users.byRole).map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend
                                            formatter={(value) => <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{value}</span>}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </MuiBox>
                        </MuiPaper>
                    </MuiGrid>
                )}

                {/* Stats Overview - Area Chart */}
                <MuiGrid item xs={12}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            background: 'var(--color-paper)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-lg)'
                        }}
                    >
                        <MuiBox sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid var(--color-border)' }}>
                            <MuiBox sx={{
                                width: 40, height: 40, borderRadius: '10px',
                                background: 'var(--color-info-50)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--color-info-600)'
                            }}>
                                <TrendingUp size={20} />
                            </MuiBox>
                            <MuiBox>
                                <MuiTypography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '1rem' }}>
                                    ملخص الأداء
                                </MuiTypography>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                    نظرة عامة على مؤشرات النظام الرئيسية
                                </MuiTypography>
                            </MuiBox>
                        </MuiBox>
                        <MuiBox sx={{ p: 3, height: 280, direction: 'ltr' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={[
                                        { name: 'المستخدمين', القيمة: stats.totalUsers || 0 },
                                        { name: 'القاعات', القيمة: stats.totalHalls || 0 },
                                        { name: 'الفعاليات', القيمة: stats.totalEvents || 0 },
                                        { name: 'الدعوات', القيمة: stats.totalInvitations || 0 },
                                        { name: 'المدفوعات', القيمة: stats.completedPayments || 0 },
                                    ]}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                    <XAxis dataKey="name" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                                    <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="القيمة" radius={[8, 8, 0, 0]}>
                                        {[
                                            { name: 'المستخدمين', القيمة: stats.totalUsers || 0 },
                                            { name: 'القاعات', القيمة: stats.totalHalls || 0 },
                                            { name: 'الفعاليات', القيمة: stats.totalEvents || 0 },
                                            { name: 'الدعوات', القيمة: stats.totalInvitations || 0 },
                                            { name: 'المدفوعات', القيمة: stats.completedPayments || 0 },
                                        ].map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>
            </MuiGrid>

            {/* Top Performing Halls */}
            {stats.topHalls && stats.topHalls.length > 0 && (
                <MuiPaper
                    elevation={0}
                    sx={{
                        background: 'var(--color-paper)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: 'var(--shadow-lg)',
                        mt: 3
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
                                    background: 'var(--color-success-50)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--color-success-600)'
                                }}>
                                    <TrendingUp size={24} strokeWidth={2.5} />
                                </MuiBox>
                                <MuiBox>
                                    <MuiTypography variant="h6" sx={{
                                        fontWeight: 700,
                                        color: 'var(--color-text-primary)'
                                    }}>
                                        القاعات الأفضل أداءً
                                    </MuiTypography>
                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                        القاعات ذات أعلى إيرادات وعدد فعاليات
                                    </MuiTypography>
                                </MuiBox>
                            </MuiBox>
                        </MuiBox>
                    </MuiBox>

                    {/* Content */}
                    <MuiBox sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                        <MuiGrid container spacing={3}>
                            {stats.topHalls.map((hall, index) => (
                                <MuiGrid item xs={12} sm={6} md={4} key={hall._id || index}>
                                    <MuiBox
                                        sx={{
                                            p: 3,
                                            borderRadius: '16px',
                                            background: 'var(--color-success-50)',
                                            border: '1px solid var(--color-success-100)',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <MuiBox sx={{ position: 'relative', zIndex: 1 }}>
                                            <MuiTypography variant="h6" sx={{
                                                color: 'var(--color-success-700)',
                                                fontWeight: 700,
                                                mb: 2
                                            }}>
                                                {hall.hallName || 'qala ghayr ma\'rifa'}
                                            </MuiTypography>
                                            
                                            <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                <MuiBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-success-600)' }}>
                                                        الفعاليات
                                                    </MuiTypography>
                                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-success-700)', fontWeight: 600 }}>
                                                        {hall.eventCount || 0}
                                                    </MuiTypography>
                                                </MuiBox>
                                                <MuiBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-success-600)' }}>
                                                        إجمالي الإيرادات
                                                    </MuiTypography>
                                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-success-700)', fontWeight: 600 }}>
                                                        {formatCurrency(hall.totalRevenue, 'SY')}
                                                    </MuiTypography>
                                                </MuiBox>
                                            </MuiBox>
                                        </MuiBox>

                                        {/* Background Decor */}
                                        <MuiBox
                                            sx={{
                                                position: 'absolute',
                                                top: -20,
                                                right: -20,
                                                width: 80,
                                                height: 80,
                                                borderRadius: '50%',
                                                background: 'rgba(34, 197, 94, 0.1)',
                                                zIndex: 0
                                            }}
                                        />
                                    </MuiBox>
                                </MuiGrid>
                            ))}
                        </MuiGrid>
                    </MuiBox>
                </MuiPaper>
            )}
        </MuiBox>
    )
}

// Main component that wraps the content
export default function AdminDashboard() {
    return <AdminDashboardContent />
}
