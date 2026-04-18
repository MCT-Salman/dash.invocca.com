import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTheme, useMediaQuery } from '@mui/material'

// MUI Components
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiButton from '@/components/ui/MuiButton'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiDivider from '@/components/ui/MuiDivider'
import MuiChip from '@/components/ui/MuiChip'

// Layout & Common Components
import { LoadingScreen, EmptyState, SEOHead, StatCard, PageHeader } from '@/components/common'

// Hooks & Utilities
import { useNotification } from '@/hooks'
import { QUERY_KEYS } from '@/config/constants'
import { getReports } from '@/api/admin'
import { formatCurrency, formatDate, getImageUrl } from '@/utils/helpers'

// Icons
import {
    BarChart3,
    TrendingUp,
    Users,
    Building2,
    DollarSign,
    Download,
    Calendar,
    FileText,
    RefreshCw,
    PieChart,
    MapPin,
    Phone,
    User,
    CheckCircle,
    XCircle,
    Armchair,
    Table,
    UsersRound,
    Sparkles,
    Music,
    Activity
} from 'lucide-react'

const roleLabels = {
    admin: 'مدير',
    manager: 'مدير صالة',
    client: 'عميل',
    scanner: 'ماسح',
}

const roleColors = {
    admin: 'var(--color-secondary-500)',
    manager: 'var(--color-primary-500)',
    client: 'var(--color-success-500)',
    scanner: 'var(--color-info-500)',
}

const serviceCategoryLabels = {
    entertainment: 'ترفيه',
    food: 'طعام',
    decoration: 'ديكور',
    photography: 'تصوير',
    music: 'موسيقى',
    other: 'أخرى',
}

const serviceUnitLabels = {
    per_event: 'لكل فعالية',
    per_hour: 'لكل ساعة',
    per_day: 'لكل يوم',
    per_person: 'لكل شخص',
}

// ====================== Main Component ======================
export default function ReportsManagement() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const { addNotification: showNotification } = useNotification()

    // State
    const [dateRange, setDateRange] = useState({ start: '', end: '' })

    // Fetch Reports
    const { data: reportsData, isLoading, refetch } = useQuery({
        queryKey: [QUERY_KEYS.ADMIN_REPORTS],
        queryFn: () => getReports(),
    })

    const reports = reportsData?.data || reportsData || {}
    const stats = useMemo(() => {
        const halls = reports.hallsWithDetails || []
        const totalHalls = halls.length
        const activeHalls = halls.filter(hall => hall.isActive).length
        const inactiveHalls = halls.filter(hall => !hall.isActive).length

        const totalUsers = (reports.usersByRole || []).reduce((acc, role) => acc + (role.count || 0), 0)
        const activeUsers = (reports.usersByRole || []).reduce((acc, role) => acc + (role.active || 0), 0)

        const totalCapacity = halls.reduce((acc, hall) => acc + (hall.capacity || 0), 0)
        const totalTables = halls.reduce((acc, hall) => acc + (hall.tables || 0), 0)
        const totalChairs = halls.reduce((acc, hall) => acc + (hall.chairs || 0), 0)

        const totalRevenue = (reports.monthlyRevenueByHall || []).reduce((acc, hall) => acc + (hall.totalRevenue || 0), 0)
        const upcomingEvents = (reports.eventsByHall || []).reduce((acc, hall) => acc + (hall.count || 0), 0)

        const invitationStats = reports.invitationStats || {}
        const totalInvitations = invitationStats.totalInvitations || 0
        const usedInvitations = invitationStats.usedInvitations || 0
        const totalGuests = invitationStats.totalGuests || 0

        return {
            totalRevenue,
            totalHalls,
            activeHalls,
            inactiveHalls,
            totalUsers,
            activeUsers,
            totalCapacity,
            totalTables,
            totalChairs,
            upcomingEvents,
            totalInvitations,
            usedInvitations,
            totalGuests
        }
    }, [reports])

    const handleExport = (type) => {
        showNotification({
            title: 'تنبيه',
            message: `جاري تحضير ملف الـ ${type === 'excel' ? 'Excel' : 'PDF'}...`,
            type: 'info'
        })
    }

    const handleRefresh = () => {
        refetch()
        showNotification({ title: 'تحديث', message: 'تم تحديث البيانات بنجاح', type: 'success' })
    }

    const getRoleName = (roleId) => {
        if (Array.isArray(roleId)) {
            return roleId.map(r => roleLabels[r] || r).join('، ')
        }
        return roleLabels[roleId] || roleId
    }

    const getRoleColor = (roleId) => {
        const primaryRole = Array.isArray(roleId) ? roleId[0] : roleId
        return roleColors[primaryRole] || 'var(--color-primary-500)'
    }

    if (isLoading) return <LoadingScreen message="جاري تحليل البيانات وإعداد التقارير..." />

    const halls = reports.hallsWithDetails || []

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
            <SEOHead title="التقارير والإحصائيات | INVOCCA" />

            <PageHeader
                icon={BarChart3}
                title="التقارير والإحصائيات"
                subtitle="نظرة شاملة على أداء النظام، الإيرادات، ونمو المستخدمين"
                actions={
                    <MuiBox sx={{ display: 'flex', gap: 2 }}>
                        <MuiButton
                            variant="outlined"
                            start_icon={<RefreshCw size={18} />}
                            onClick={handleRefresh}
                        >
                            تحديث
                        </MuiButton>
                        <MuiButton
                            variant="contained"
                            start_icon={<Download size={18} />}
                            onClick={() => handleExport('excel')}
                        >
                            تصدير Excel
                        </MuiButton>
                    </MuiBox>
                }
            />

            {/* Stats Overview - Main Metrics */}
            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="إجمالي القاعات"
                        value={stats.totalHalls || 0}
                        icon={<Building2 size={24} />}
                        sx={{ borderTop: '4px solid var(--color-primary-500)' }}
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="القاعات النشطة"
                        value={stats.activeHalls || 0}
                        icon={<CheckCircle size={24} />}
                        sx={{ borderTop: '4px solid var(--color-success-500)' }}
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="إجمالي المستخدمين"
                        value={stats.totalUsers || 0}
                        icon={<Users size={24} />}
                        sx={{ borderTop: '4px solid var(--color-secondary-500)' }}
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="الإيرادات"
                        value={formatCurrency(stats.totalRevenue || 0)}
                        icon={<DollarSign size={24} />}
                        color="success"
                    />
                </MuiGrid>
            </MuiGrid>

            {/* Stats Overview - Capacity & Invitations */}
            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="السعة الإجمالية"
                        value={stats.totalCapacity || 0}
                        icon={<UsersRound size={24} />}
                        color="info"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="الفعاليات القادمة"
                        value={stats.upcomingEvents || 0}
                        icon={<Calendar size={24} />}
                        color="info"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="إجمالي الدعوات"
                        value={stats.totalInvitations || 0}
                        icon={<FileText size={24} />}
                        color="primary"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="إجمالي الضيوف"
                        value={stats.totalGuests || 0}
                        icon={<Users size={24} />}
                        color="secondary"
                    />
                </MuiGrid>
            </MuiGrid>

            {/* Charts and Data Visualization */}
            <MuiGrid container spacing={3}>
                {/* Halls Distribution Chart */}
                <MuiGrid item xs={12} md={6}>
                    <MuiPaper
                        sx={{
                            p: 3,
                            borderRadius: '20px',
                            background: 'var(--color-surface-dark)',
                            border: '1px solid var(--color-border-glass)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'auto'
                        }}
                    >
                        <MuiTypography variant="h6" sx={{ mb: 3, fontWeight: 700, color: 'var(--color-text-primary-dark)', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PieChart size={20} className="text-primary-500" />
                            توزيع القاعات
                        </MuiTypography>
                        <MuiBox sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>القاعات النشطة</MuiTypography>
                                <MuiTypography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                                    {stats.activeHalls || 0} / {stats.totalHalls || 0}
                                </MuiTypography>
                            </MuiBox>
                            <MuiBox sx={{ height: '12px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                                <MuiBox sx={{ height: '100%', width: `${stats.totalHalls > 0 ? (stats.activeHalls / stats.totalHalls) * 100 : 0}%`, background: 'linear-gradient(90deg, var(--color-success-500), var(--color-success-600))', borderRadius: '6px' }} />
                            </MuiBox>

                            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>القاعات غير نشطة</MuiTypography>
                                <MuiTypography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                                    {stats.inactiveHalls || 0}
                                </MuiTypography>
                            </MuiBox>
                            <MuiBox sx={{ height: '12px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                                <MuiBox sx={{ height: '100%', width: `${stats.totalHalls > 0 ? (stats.inactiveHalls / stats.totalHalls) * 100 : 0}%`, background: 'linear-gradient(90deg, var(--color-error-500), var(--color-error-600))', borderRadius: '6px' }} />
                            </MuiBox>

                            <MuiDivider sx={{ my: 2, borderColor: 'var(--color-border-glass)' }} />

                            <MuiTypography variant="subtitle2" sx={{ color: 'var(--color-primary-400)', mb: 2 }}>توزيع السعة</MuiTypography>
                            {(() => {
                                const capacityRanges = {
                                    'صغيرة (0-100)': halls.filter(h => (h.capacity || 0) <= 100).length,
                                    'متوسطة (101-300)': halls.filter(h => (h.capacity || 0) > 100 && (h.capacity || 0) <= 300).length,
                                    'كبيرة (301-500)': halls.filter(h => (h.capacity || 0) > 300 && (h.capacity || 0) <= 500).length,
                                    'كبيرة جداً (500+)': halls.filter(h => (h.capacity || 0) > 500).length
                                }

                                return Object.entries(capacityRanges).map(([label, count]) => (
                                    <MuiBox key={label} sx={{ mb: 2 }}>
                                        <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>{label}</MuiTypography>
                                            <MuiTypography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>{count}</MuiTypography>
                                        </MuiBox>
                                        <MuiBox sx={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <MuiBox sx={{ height: '100%', width: `${halls.length > 0 ? (count / halls.length) * 100 : 0}%`, background: 'var(--color-primary-500)', borderRadius: '3px' }} />
                                        </MuiBox>
                                    </MuiBox>
                                ))
                            })()}
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>

                {/* User Roles Distribution */}
                <MuiGrid item xs={12} md={6}>
                    <MuiPaper
                        sx={{
                            p: 3,
                            borderRadius: '20px',
                            background: 'var(--color-surface-dark)',
                            border: '1px solid var(--color-border-glass)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'auto'
                        }}
                    >
                        <MuiTypography variant="h6" sx={{ mb: 3, fontWeight: 700, color: 'var(--color-text-primary-dark)', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Users size={20} className="text-primary-500" />
                            توزيع المستخدمين
                        </MuiTypography>
                        <MuiBox sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {(reports.usersByRole || []).map((role, index) => {
                                const roleName = getRoleName(role._id)
                                const roleColor = getRoleColor(role._id)
                                return (
                                    <MuiBox key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <MuiBox sx={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: '12px',
                                            background: `linear-gradient(135deg, ${roleColor}, ${roleColor}dd)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'column'
                                        }}>
                                            <User size={24} style={{ color: '#fff' }} />
                                            <MuiTypography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>
                                                {role.count || 0}
                                            </MuiTypography>
                                        </MuiBox>
                                        <MuiBox sx={{ flex: 1 }}>
                                            <MuiTypography variant="body1" sx={{ color: '#fff', fontWeight: 600, mb: 0.5 }}>
                                                {roleName}
                                            </MuiTypography>
                                            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                                نشط: {role.active || 0} | إجمالي: {role.count || 0}
                                            </MuiTypography>
                                        </MuiBox>
                                    </MuiBox>
                                )
                            })}
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>

                {/* Halls Details Cards */}
                <MuiGrid item xs={12}>
                    <MuiPaper
                        sx={{
                            p: 3,
                            borderRadius: '20px',
                            background: 'var(--color-surface-dark)',
                            border: '1px solid var(--color-border-glass)',
                        }}
                    >
                        <MuiTypography variant="h6" sx={{ mb: 3, fontWeight: 700, color: 'var(--color-text-primary-dark)', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Building2 size={20} className="text-primary-500" />
                            تفاصيل القاعات
                        </MuiTypography>
                        <MuiGrid container spacing={3}>
                            {halls.length > 0 ? halls.map((hall) => {
                                const imageUrl = hall.primaryImage?.url ? getImageUrl(hall.primaryImage.url) : null
                                return (
                                    <MuiGrid item xs={12} sm={6} md={4} key={hall._id || hall.id}>
                                        <MuiBox sx={{
                                            borderRadius: '16px',
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid var(--color-border-glass)',
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                borderColor: 'var(--color-primary-500)',
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                                            }
                                        }}>
                                            {/* Hall Image */}
                                            <MuiBox sx={{
                                                height: 160,
                                                background: imageUrl ? 'transparent' : 'linear-gradient(135deg, var(--color-primary-900), var(--color-primary-800))',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                overflow: 'hidden',
                                                position: 'relative'
                                            }}>
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={hall.name}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        onError={(e) => { e.target.style.display = 'none' }}
                                                    />
                                                ) : (
                                                    <Building2 size={48} style={{ color: 'var(--color-primary-400)', opacity: 0.5 }} />
                                                )}
                                                {/* Status Badge */}
                                                <MuiBox sx={{
                                                    position: 'absolute',
                                                    top: 12,
                                                    left: 12,
                                                }}>
                                                    <MuiChip
                                                        label={hall.isActive ? 'نشطة' : 'غير نشطة'}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: hall.isActive ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                                                            color: '#fff',
                                                            fontWeight: 700,
                                                            fontSize: '0.7rem',
                                                            height: 24,
                                                            borderRadius: '8px',
                                                        }}
                                                    />
                                                </MuiBox>
                                            </MuiBox>

                                            {/* Hall Info */}
                                            <MuiBox sx={{ p: 2.5 }}>
                                                <MuiTypography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 1, fontSize: '1rem' }}>
                                                    {hall.name || 'قاعة بدون اسم'}
                                                </MuiTypography>

                                                {/* Location */}
                                                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                                    <MapPin size={14} style={{ color: 'var(--color-text-secondary)' }} />
                                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                                        {hall.location || 'غير محدد'}
                                                    </MuiTypography>
                                                </MuiBox>

                                                {/* Capacity & Resources */}
                                                <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                                                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <UsersRound size={14} style={{ color: 'var(--color-primary-400)' }} />
                                                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                                            {hall.capacity} شخص
                                                        </MuiTypography>
                                                    </MuiBox>
                                                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Table size={14} style={{ color: 'var(--color-success-400)' }} />
                                                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                                            {hall.tables} طاولة
                                                        </MuiTypography>
                                                    </MuiBox>
                                                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Armchair size={14} style={{ color: 'var(--color-info-400)' }} />
                                                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                                            {hall.chairs} كرسي
                                                        </MuiTypography>
                                                    </MuiBox>
                                                </MuiBox>

                                                {/* Default Price */}
                                                <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                                        السعر الافتراضي
                                                    </MuiTypography>
                                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)', fontWeight: 700 }}>
                                                        {formatCurrency(hall.defaultPrices || 0)}
                                                    </MuiTypography>
                                                </MuiBox>

                                                {/* Manager Info */}
                                                {hall.generalManager && (
                                                    <MuiBox sx={{
                                                        p: 1.5,
                                                        borderRadius: '10px',
                                                        background: 'rgba(255,255,255,0.03)',
                                                        border: '1px solid var(--color-border-glass)',
                                                        mb: 2
                                                    }}>
                                                        <MuiTypography variant="caption" sx={{ color: 'var(--color-primary-400)', fontWeight: 600, display: 'block', mb: 1 }}>
                                                            مدير الصالة
                                                        </MuiTypography>
                                                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                            <User size={12} style={{ color: 'var(--color-text-secondary)' }} />
                                                            <MuiTypography variant="caption" sx={{ color: '#fff', fontWeight: 500 }}>
                                                                {hall.generalManager.name}
                                                            </MuiTypography>
                                                        </MuiBox>
                                                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Phone size={12} style={{ color: 'var(--color-text-secondary)' }} />
                                                            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                                                {hall.generalManager.phone}
                                                            </MuiTypography>
                                                        </MuiBox>
                                                    </MuiBox>
                                                )}

                                                {/* Services */}
                                                {hall.services && hall.services.length > 0 && (
                                                    <MuiBox>
                                                        <MuiTypography variant="caption" sx={{ color: 'var(--color-primary-400)', fontWeight: 600, display: 'block', mb: 1 }}>
                                                            الخدمات ({hall.services.length})
                                                        </MuiTypography>
                                                        <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                            {hall.services.map((service, idx) => (
                                                                <MuiChip
                                                                    key={service._id || idx}
                                                                    label={`${service.name} - ${formatCurrency(service.price || 0)}`}
                                                                    size="small"
                                                                    sx={{
                                                                        backgroundColor: 'rgba(216, 185, 138, 0.1)',
                                                                        color: 'var(--color-primary-300)',
                                                                        fontWeight: 500,
                                                                        fontSize: '0.65rem',
                                                                        height: 22,
                                                                        borderRadius: '6px',
                                                                        border: '1px solid rgba(216, 185, 138, 0.2)',
                                                                    }}
                                                                />
                                                            ))}
                                                        </MuiBox>
                                                    </MuiBox>
                                                )}
                                            </MuiBox>
                                        </MuiBox>
                                    </MuiGrid>
                                )
                            }) : (
                                <MuiGrid item xs={12}>
                                    <EmptyState
                                        title="لا توجد قاعات"
                                        description="لم يتم تسجيل أي قاعات بعد"
                                        icon={Building2}
                                    />
                                </MuiGrid>
                            )}
                        </MuiGrid>
                    </MuiPaper>
                </MuiGrid>

                {/* Monthly Revenue by Hall */}
                {reports.monthlyRevenueByHall && reports.monthlyRevenueByHall.length > 0 && (
                    <MuiGrid item xs={12}>
                        <MuiPaper
                            sx={{
                                p: 3,
                                borderRadius: '20px',
                                background: 'var(--color-surface-dark)',
                                border: '1px solid var(--color-border-glass)',
                            }}
                        >
                            <MuiTypography variant="h6" sx={{ mb: 3, fontWeight: 700, color: 'var(--color-text-primary-dark)', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <DollarSign size={20} className="text-primary-500" />
                                الإيرادات الشهرية حسب القاعة
                            </MuiTypography>
                            <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {reports.monthlyRevenueByHall.map((hall, index) => (
                                    <MuiBox key={hall._id || index} sx={{
                                        p: 2,
                                        borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid var(--color-border-glass)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Building2 size={20} style={{ color: 'var(--color-primary-400)' }} />
                                            <MuiTypography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                                                {hall.hallName || hall.name || 'قاعة غير معروفة'}
                                            </MuiTypography>
                                        </MuiBox>
                                        <MuiTypography variant="h6" sx={{ color: 'var(--color-success-400)', fontWeight: 700 }}>
                                            {formatCurrency(hall.totalRevenue || 0)}
                                        </MuiTypography>
                                    </MuiBox>
                                ))}
                            </MuiBox>
                        </MuiPaper>
                    </MuiGrid>
                )}

                {/* Recent Activities */}
                {reports.recentActivities && reports.recentActivities.length > 0 && (
                    <MuiGrid item xs={12}>
                        <MuiPaper
                            sx={{
                                p: 3,
                                borderRadius: '20px',
                                background: 'var(--color-surface-dark)',
                                border: '1px solid var(--color-border-glass)',
                            }}
                        >
                            <MuiTypography variant="h6" sx={{ mb: 3, fontWeight: 700, color: 'var(--color-text-primary-dark)', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Activity size={20} className="text-primary-500" />
                                النشاطات الأخيرة
                            </MuiTypography>
                            <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {reports.recentActivities.map((activity, index) => (
                                    <MuiBox key={activity._id || index} sx={{
                                        p: 2,
                                        borderRadius: '10px',
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid var(--color-border-glass)',
                                    }}>
                                        <MuiTypography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
                                            {activity.description || activity.message || 'نشاط'}
                                        </MuiTypography>
                                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                            {activity.createdAt ? formatDate(activity.createdAt) : ''}
                                        </MuiTypography>
                                    </MuiBox>
                                ))}
                            </MuiBox>
                        </MuiPaper>
                    </MuiGrid>
                )}

                {/* Events by Hall */}
                {reports.eventsByHall && reports.eventsByHall.length > 0 && (
                    <MuiGrid item xs={12}>
                        <MuiPaper
                            sx={{
                                p: 3,
                                borderRadius: '20px',
                                background: 'var(--color-surface-dark)',
                                border: '1px solid var(--color-border-glass)',
                            }}
                        >
                            <MuiTypography variant="h6" sx={{ mb: 3, fontWeight: 700, color: 'var(--color-text-primary-dark)', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Calendar size={20} className="text-primary-500" />
                                الفعاليات حسب القاعة
                            </MuiTypography>
                            <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {reports.eventsByHall.map((hall, index) => (
                                    <MuiBox key={hall._id || index} sx={{
                                        p: 2,
                                        borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid var(--color-border-glass)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Calendar size={20} style={{ color: 'var(--color-info-400)' }} />
                                            <MuiTypography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                                                {hall.hallName || hall.name || 'قاعة غير معروفة'}
                                            </MuiTypography>
                                        </MuiBox>
                                        <MuiChip
                                            label={`${hall.count || 0} فعالية`}
                                            sx={{
                                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                                color: 'var(--color-info-400)',
                                                fontWeight: 600,
                                                border: '1px solid rgba(59, 130, 246, 0.2)',
                                            }}
                                        />
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
