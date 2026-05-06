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
import { LoadingScreen, EmptyState, SEOHead, StatCard } from '@/components/common'
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

const CHART_COLORS = ['var(--color-icon)', 'var(--color-icon)', 'var(--color-icon)', 'var(--color-icon)', 'var(--color-icon)', 'var(--color-icon)', 'var(--color-icon)', 'var(--color-icon)']

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
        <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-light-soft)' }}>
            <SEOHead pageKey="adminDashboard" />

            {/* Stats Grid */}
            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="إجمالي المستخدمين"
                        value={formatNumber(stats.totalUsers || 0)}
                        icon={<Users size={24} />}
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="إجمالي القاعات"
                        value={formatNumber(stats.totalHalls || 0)}
                        icon={<Building2 size={24} />}
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="إجمالي الفعاليات"
                        value={formatNumber(stats.totalEvents || 0)}
                        icon={<Calendar size={24} />}
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="إجمالي الإيرادات"
                        value={formatCurrency(stats.totalRevenue || 0, 'SY')}
                        icon={<DollarSign size={24} />}
                    />
                </MuiGrid>
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
                            boxShadow: 'none'
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
                                        background: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--color-icon)'
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
                                            background: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
                                            border: '1px solid var(--color-border)',
                                            textAlign: 'center',
                                            minWidth: 80
                                        }}
                                    >
                                        <MuiTypography variant="h6" sx={{
                                            color: 'var(--color-icon)',
                                            fontWeight: 700
                                        }}>
                                            {count}
                                        </MuiTypography>
                                        <MuiTypography variant="caption" sx={{
                                            color: 'var(--color-text-secondary)',
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
                            boxShadow: 'none'
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
                                        background: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--color-icon)'
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
                                                            backgroundColor: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
                                                            color: 'var(--color-icon)',
                                                            fontWeight: 600,
                                                            fontSize: '0.75rem',
                                                            height: 24,
                                                            border: '1px solid var(--color-border)'
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
                                                        backgroundColor: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
                                                        color: 'var(--color-icon)',
                                                        fontWeight: 700,
                                                        fontSize: '0.75rem',
                                                        height: 28,
                                                        borderRadius: '8px',
                                                        border: '1px solid var(--color-border)'
                                                    }}
                                                />
                                                {event.totalPrice && (
                                                    <MuiTypography variant="caption" sx={{ 
                                                        color: 'var(--color-text-secondary)',
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
                                boxShadow: 'none'
                            }}
                        >
                            <MuiBox sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid var(--color-border)' }}>
                                <MuiBox sx={{
                                    width: 40, height: 40, borderRadius: '10px',
                                    background: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--color-icon)'
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
                                        <Bar dataKey="إيرادات" fill="var(--color-icon)" radius={[6, 6, 0, 0]} />
                                        <Bar dataKey="فعاليات" fill="var(--color-icon)" radius={[6, 6, 0, 0]} />
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
                                boxShadow: 'none'
                            }}
                        >
                            <MuiBox sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid var(--color-border)' }}>
                                <MuiBox sx={{
                                    width: 40, height: 40, borderRadius: '10px',
                                    background: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--color-icon)'
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
                            boxShadow: 'none'
                        }}
                    >
                        <MuiBox sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid var(--color-border)' }}>
                            <MuiBox sx={{
                                width: 40, height: 40, borderRadius: '10px',
                                background: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--color-icon)'
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
                                    background: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--color-icon)'
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
                                            background: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
                                            border: '1px solid var(--color-border)',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <MuiBox sx={{ position: 'relative', zIndex: 1 }}>
                                            <MuiTypography variant="h6" sx={{
                                                color: 'var(--color-icon)',
                                                fontWeight: 700,
                                                mb: 2
                                            }}>
                                                {hall.hallName || 'qala ghayr ma\'rifa'}
                                            </MuiTypography>
                                            
                                            <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                <MuiBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-icon)' }}>
                                                        الفعاليات
                                                    </MuiTypography>
                                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-icon)', fontWeight: 600 }}>
                                                        {hall.eventCount || 0}
                                                    </MuiTypography>
                                                </MuiBox>
                                                <MuiBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-icon)' }}>
                                                        إجمالي الإيرادات
                                                    </MuiTypography>
                                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-icon)', fontWeight: 600 }}>
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
                                                background: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
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
