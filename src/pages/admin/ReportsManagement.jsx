import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTheme, useMediaQuery } from '@mui/material'

// MUI Components
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiButton from '@/components/ui/MuiButton'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiCard from '@/components/ui/MuiCard'
import MuiCardContent from '@/components/ui/MuiCardContent'
import MuiDivider from '@/components/ui/MuiDivider'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiInputAdornment from '@/components/ui/MuiInputAdornment'
import MuiChip from '@/components/ui/MuiChip'

// Layout & Common Components
import { LoadingScreen, EmptyState, SEOHead, StatCard } from '@/components/common'

// Hooks & Utilities
import { useNotification } from '@/hooks'
import { QUERY_KEYS } from '@/config/constants'
import { getReports } from '@/api/admin'
import { formatCurrency, formatDate } from '@/utils/helpers'

// Icons
import {
    BarChart3,
    TrendingUp,
    Users,
    Building2,
    DollarSign,
    Download,
    Calendar,
    Filter,
    FileSpreadsheet,
    FileText,
    RefreshCw,
    PieChart,
    LineChart,
    ClipboardList,
    MapPin,
    Phone,
    User,
    CheckCircle,
    XCircle,
    Eye,
    Image as ImageIcon
} from 'lucide-react'

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
        // Derive comprehensive stats from the provided structure
        const halls = reports.hallsWithDetails || []
        const totalHalls = halls.length
        const activeHalls = halls.filter(hall => hall.isActive).length
        const inactiveHalls = halls.filter(hall => !hall.isActive).length
        
        // User statistics
        const totalUsers = (reports.usersByRole || []).reduce((acc, role) => acc + (role.count || 0), 0)
        const activeUsers = (reports.usersByRole || []).reduce((acc, role) => acc + (role.active || 0), 0)
        
        // Hall capacity statistics
        const totalCapacity = halls.reduce((acc, hall) => acc + (hall.capacity || 0), 0)
        const totalTables = halls.reduce((acc, hall) => acc + (hall.tables || 0), 0)
        const totalChairs = halls.reduce((acc, hall) => acc + (hall.chairs || 0), 0)
        
        // Revenue and events
        const totalRevenue = (reports.monthlyRevenueByHall || []).reduce((acc, hall) => acc + (hall.totalRevenue || 0), 0)
        const upcomingEvents = (reports.eventsByHall || []).reduce((acc, hall) => acc + (hall.count || 0), 0)
        
        // Invitation statistics
        const invitationStats = reports.invitationStats || {}
        const totalInvitations = invitationStats.totalInvitations || 0
        const usedInvitations = invitationStats.usedInvitations || 0
        const totalGuests = invitationStats.totalGuests || 0

        return {
            totalRevenue: reports.stats?.totalRevenue || totalRevenue || 0,
            totalHalls: reports.stats?.totalHalls || totalHalls || 0,
            activeHalls: reports.stats?.activeHalls || activeHalls || 0,
            inactiveHalls: reports.stats?.inactiveHalls || inactiveHalls || 0,
            totalUsers: reports.stats?.totalUsers || totalUsers || 0,
            activeUsers: reports.stats?.activeUsers || activeUsers || 0,
            totalCapacity: reports.stats?.totalCapacity || totalCapacity || 0,
            totalTables: reports.stats?.totalTables || totalTables || 0,
            totalChairs: reports.stats?.totalChairs || totalChairs || 0,
            upcomingEvents: reports.stats?.upcomingEvents || upcomingEvents || 0,
            totalInvitations: reports.stats?.totalInvitations || totalInvitations || 0,
            usedInvitations: reports.stats?.usedInvitations || usedInvitations || 0,
            totalGuests: reports.stats?.totalGuests || totalGuests || 0
        }
    }, [reports])

    const charts = reports.charts || reports || {}

    const handleExport = (type) => {
        showNotification({
            title: 'تنبيه',
            message: `جاري تحضير ملف الـ ${type === 'excel' ? 'Excel' : 'PDF'}...`,
            type: 'info'
        })
        // Implement actual export logic here
    }

    const handleRefresh = () => {
        refetch()
        showNotification({ title: 'تحديث', message: 'تم تحديث البيانات بنجاح', type: 'success' })
    }

    if (isLoading) return <LoadingScreen message="جاري تحليل البيانات وإعداد التقارير..." />

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
            <SEOHead title="التقارير والإحصائيات | INVOCCA" />

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
                <MuiBox sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                            <BarChart3 size={28} className="text-white" />
                        </MuiBox>
                        <MuiBox>
                            <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700, mb: 0.5 }}>
                                التقارير والإحصائيات
                            </MuiTypography>
                            <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                                نظرة شاملة على أداء النظام، الإيرادات، ونمو المستخدمين
                            </MuiTypography>
                        </MuiBox>
                    </MuiBox>

                    <MuiBox sx={{ display: 'flex', gap: 2 }}>
                        <MuiButton
                            variant="outlined"
                            startIcon={<RefreshCw size={20} />}
                            onClick={handleRefresh}
                            sx={{
                                borderRadius: '12px',
                                borderColor: 'var(--color-border-glass)',
                                color: '#fff',
                                '&:hover': { borderColor: 'var(--color-primary-500)', background: 'rgba(216, 185, 138, 0.1)' }
                            }}
                        >
                            تحديث
                        </MuiButton>
                        <MuiButton
                            variant="contained"
                            startIcon={<Download size={20} />}
                            onClick={() => handleExport('excel')}
                            sx={{
                                background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-800))',
                                color: '#fff',
                                fontWeight: 600,
                                borderRadius: '12px',
                                '&:hover': { background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-900))' }
                            }}
                        >
                            تصدير Excel
                        </MuiButton>
                    </MuiBox>
                </MuiBox>
            </MuiBox>

            {/* Stats Overview - Main Metrics */}
            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="إجمالي الصالات"
                        value={stats.totalHalls || 0}
                        icon={<Building2 size={24} />}
                        trend={{ value: 5, isPositive: true }}
                        color="primary"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="الصالات النشطة"
                        value={stats.activeHalls || 0}
                        icon={<CheckCircle size={24} />}
                        trend={{ value: 8, isPositive: true }}
                        color="success"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="الصالات غير نشطة"
                        value={stats.inactiveHalls || 0}
                        icon={<XCircle size={24} />}
                        trend={{ value: 2, isPositive: false }}
                        color="warning"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="إجمالي المستخدمين"
                        value={stats.totalUsers || 0}
                        icon={<Users size={24} />}
                        trend={{ value: 8, isPositive: true }}
                        color="secondary"
                    />
                </MuiGrid>
            </MuiGrid>

            {/* Stats Overview - Capacity & Resources */}
            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="السعة الإجمالية"
                        value={stats.totalCapacity || 0}
                        icon={<Users size={24} />}
                        color="info"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="إجمالي الطاولات"
                        value={stats.totalTables || 0}
                        icon={<ClipboardList size={24} />}
                        color="primary"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="إجمالي الكراسي"
                        value={stats.totalChairs || 0}
                        icon={<Users size={24} />}
                        color="secondary"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="الإيرادات"
                        value={formatCurrency(stats.totalRevenue || 0)}
                        icon={<DollarSign size={24} />}
                        trend={{ value: 12, isPositive: true }}
                        color="success"
                    />
                </MuiGrid>
            </MuiGrid>

            {/* Stats Overview - Events & Invitations */}
            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="الفعاليات القادمة"
                        value={stats.upcomingEvents || 0}
                        icon={<Calendar size={24} />}
                        trend={{ value: 15, isPositive: true }}
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
                        title="الدعوات المستخدمة"
                        value={stats.usedInvitations || 0}
                        icon={<CheckCircle size={24} />}
                        color="success"
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
                            height: '400px',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'auto'
                        }}
                    >
                        <MuiTypography variant="h6" sx={{ mb: 3, fontWeight: 700, color: 'var(--color-text-primary-dark)', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PieChart size={20} className="text-primary-500" />
                            توزيع الصالات
                        </MuiTypography>
                        <MuiBox sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>الصالات النشطة</MuiTypography>
                                <MuiTypography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                                    {stats.activeHalls || 0} / {stats.totalHalls || 0}
                                </MuiTypography>
                            </MuiBox>
                            <MuiBox sx={{ height: '12px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                                <MuiBox sx={{ height: '100%', width: `${stats.totalHalls > 0 ? (stats.activeHalls / stats.totalHalls) * 100 : 0}%`, background: 'linear-gradient(90deg, var(--color-success-500), var(--color-success-600))', borderRadius: '6px' }} />
                            </MuiBox>
                            
                            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>الصالات غير نشطة</MuiTypography>
                                <MuiTypography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                                    {stats.inactiveHalls || 0}
                                </MuiTypography>
                            </MuiBox>
                            <MuiBox sx={{ height: '12px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                                <MuiBox sx={{ height: '100%', width: `${stats.totalHalls > 0 ? (stats.inactiveHalls / stats.totalHalls) * 100 : 0}%`, background: 'linear-gradient(90deg, var(--color-error-500), var(--color-error-600))', borderRadius: '6px' }} />
                            </MuiBox>
                            
                            <MuiDivider sx={{ my: 2, borderColor: 'var(--color-border-glass)' }} />
                            
                            {/* Hall Capacity Distribution */}
                            <MuiTypography variant="subtitle2" sx={{ color: 'var(--color-primary-400)', mb: 2 }}>توزيع السعة</MuiTypography>
                            {(() => {
                                const halls = reports.hallsWithDetails || []
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
                            height: '400px',
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
                            {(reports.usersByRole || []).map((role) => (
                                <MuiBox key={role._id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <MuiBox sx={{ 
                                        width: 60, 
                                        height: 60, 
                                        borderRadius: '12px', 
                                        background: role._id === 'admin' ? 'linear-gradient(135deg, var(--color-secondary-500), var(--color-secondary-700))' : 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
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
                                            {role._id === 'admin' ? 'مديري النظام' : 'المديرين'}
                                        </MuiTypography>
                                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                            نشط: {role.active || 0} | إجمالي: {role.count || 0}
                                        </MuiTypography>
                                    </MuiBox>
                                </MuiBox>
                            ))}
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>

                {/* Key Metrics Cards */}
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
                            <TrendingUp size={20} className="text-primary-500" />
                            مؤشرات الأداء الرئيسية
                        </MuiTypography>
                        <MuiGrid container spacing={3}>
                            <MuiGrid item xs={12} sm={6} md={3}>
                                <MuiBox sx={{ 
                                    p: 2, 
                                    borderRadius: '12px', 
                                    background: 'linear-gradient(135deg, rgba(216, 185, 138, 0.1), rgba(216, 185, 138, 0.05))',
                                    border: '1px solid var(--color-primary-500)',
                                    textAlign: 'center'
                                }}>
                                    <Building2 size={32} style={{ color: 'var(--color-primary-400)', marginBottom: '8px' }} />
                                    <MuiTypography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>
                                        {stats.totalHalls || 0}
                                    </MuiTypography>
                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                                        إجمالي الصالات
                                    </MuiTypography>
                                </MuiBox>
                            </MuiGrid>
                            <MuiGrid item xs={12} sm={6} md={3}>
                                <MuiBox sx={{ 
                                    p: 2, 
                                    borderRadius: '12px', 
                                    background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.1), rgba(22, 163, 74, 0.05))',
                                    border: '1px solid var(--color-success-500)',
                                    textAlign: 'center'
                                }}>
                                    <Users size={32} style={{ color: 'var(--color-success-400)', marginBottom: '8px' }} />
                                    <MuiTypography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>
                                        {stats.totalCapacity || 0}
                                    </MuiTypography>
                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-success-300)' }}>
                                        السعة الإجمالية
                                    </MuiTypography>
                                </MuiBox>
                            </MuiGrid>
                            <MuiGrid item xs={12} sm={6} md={3}>
                                <MuiBox sx={{ 
                                    p: 2, 
                                    borderRadius: '12px', 
                                    background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(147, 51, 234, 0.05))',
                                    border: '1px solid var(--color-secondary-500)',
                                    textAlign: 'center'
                                }}>
                                    <DollarSign size={32} style={{ color: 'var(--color-secondary-400)', marginBottom: '8px' }} />
                                    <MuiTypography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>
                                        {formatCurrency(stats.totalRevenue || 0)}
                                    </MuiTypography>
                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-secondary-300)' }}>
                                        الإيرادات
                                    </MuiTypography>
                                </MuiBox>
                            </MuiGrid>
                            <MuiGrid item xs={12} sm={6} md={3}>
                                <MuiBox sx={{ 
                                    p: 2, 
                                    borderRadius: '12px', 
                                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
                                    border: '1px solid var(--color-info-500)',
                                    textAlign: 'center'
                                }}>
                                    <Calendar size={32} style={{ color: 'var(--color-info-400)', marginBottom: '8px' }} />
                                    <MuiTypography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>
                                        {stats.upcomingEvents || 0}
                                    </MuiTypography>
                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-info-300)' }}>
                                        الفعاليات القادمة
                                    </MuiTypography>
                                </MuiBox>
                            </MuiGrid>
                        </MuiGrid>
                    </MuiPaper>
                </MuiGrid>
            </MuiGrid>
        </MuiBox>
    )
}
