// src\pages\manager\ManagerDashboard.jsx
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useAuth, useDialogState } from '@/hooks'
import MuiBox from '@/components/ui/MuiBox'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiAvatar from '@/components/ui/MuiAvatar'
import MuiDivider from '@/components/ui/MuiDivider'
import MuiButton from '@/components/ui/MuiButton'
import MuiIconButton from '@/components/ui/MuiIconButton'
import { LoadingScreen, EmptyState, SEOHead } from '@/components/common'
import { QUERY_KEYS } from '@/config/constants'
import { getManagerDashboard } from '@/api/manager'
import { formatNumber, formatCurrency, formatDate } from '@/utils/helpers'
import {
    Calendar,
    DollarSign,
    Users,
    LayoutDashboard,
    Clock,
    AlertCircle,
    CheckCircle,
    ChevronRight,
    ChevronLeft,
    CreditCard
} from 'lucide-react'
import ViewEventDialog from './components/ViewEventDialog'

const StatCard = ({ title, value, icon: Icon, trend }) => (
    <MuiPaper
        elevation={0}
        sx={{
            p: 3,
            height: '100%',
            background: 'var(--color-paper)',
            border: '1px solid var(--color-border)',
            borderRadius: '24px',
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'translateY(-6px)', borderColor: 'var(--color-icon)' }
        }}
    >
        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <MuiBox sx={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(216, 185, 138, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-icon)', border: '1px solid var(--color-border)' }}>
                <Icon size={24} />
            </MuiBox>
            <MuiBox>
                <MuiTypography variant="subtitle2" sx={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>{title}</MuiTypography>
                {trend && <MuiTypography variant="caption" sx={{ color: trend.startsWith('+') ? '#4caf50' : '#f44336', fontWeight: 700 }}>{trend}</MuiTypography>}
            </MuiBox>
        </MuiBox>
        <MuiTypography variant="h4" sx={{ fontWeight: 800 }}>{value}</MuiTypography>
    </MuiPaper>
)

export default function ManagerDashboard() {
    const { user } = useAuth()
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const { data, isLoading, error } = useQuery({
        queryKey: QUERY_KEYS.MANAGER_DASHBOARD,
        queryFn: getManagerDashboard,
    })

    const {
        selectedItem: selectedEvent,
        openViewDialog,
        closeDialog,
        isView,
    } = useDialogState()

    const dashData = useMemo(() => data?.data || {}, [data])
    const { summary, recentActivity, hall, upcomingEvents = [] } = dashData

    // Calendar Logic
    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()
        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const days = []
        for (let i = 0; i < firstDay; i++) days.push(null)
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i))
        return days
    }, [currentMonth])

    const getDayEvent = (date) => {
        if (!date) return null
        const dateStr = date.toISOString().split('T')[0]
        return recentActivity?.events?.find(e => e.date?.split('T')[0] === dateStr)
    }

    if (isLoading) return <LoadingScreen />
    if (error) return <EmptyState title="حدث خطأ" description={error.message} />

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
            <SEOHead title="لوحة التحكم | INVOCCA" />

            {/* Header Section */}
            <MuiPaper sx={{ p: 4, borderRadius: '24px', background: 'var(--color-paper)', border: '1px solid var(--color-border)', mb: 4 }}>
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                    <MuiBox sx={{ width: 64, height: 64, borderRadius: '16px', background: 'linear-gradient(135deg, var(--color-icon), var(--color-gold))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <LayoutDashboard size={32} color="white" />
                    </MuiBox>
                    <MuiBox sx={{ flex: 1 }}>
                        <MuiTypography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>مرحباً بك، مدير صالة {hall?.name || 'النمر الوردي'}</MuiTypography>
                        <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>نظرة شاملة على أداء القاعة والفعاليات القادمة</MuiTypography>
                    </MuiBox>
                    <MuiButton variant="contained" startIcon={<Calendar size={18} />} sx={{ borderRadius: '12px', px: 3 }}>جدولة فعالية</MuiButton>
                </MuiBox>
            </MuiPaper>

            {/* Stats Grid */}
            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                <MuiGrid item xs={12} sm={6} lg={3}>
                    <StatCard title="حجوزات الشهر" value={formatNumber(summary?.events?.thisMonth || 0)} icon={Calendar} trend="+15% عن الشهر الماضي" />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} lg={3}>
                    <StatCard title="الدخل الإجمالي" value={formatCurrency(summary?.financial?.totalRevenue || 0)} icon={DollarSign} trend="+8.2%" />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} lg={3}>
                    <StatCard title="المبالغ المتبقية" value={formatCurrency(summary?.financial?.totalUnpaid || 0)} icon={CreditCard} trend="تحتاج تحصيل" />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} lg={3}>
                    <StatCard title="الفعاليات القادمة (7 أيام)" value={formatNumber(summary?.events?.upcoming || 0)} icon={Clock} />
                </MuiGrid>
            </MuiGrid>

            <MuiGrid container spacing={3}>
                {/* Calendar Section */}
                <MuiGrid item xs={12} lg={8}>
                    <MuiPaper sx={{ p: 3, borderRadius: '24px', background: 'var(--color-paper)', border: '1px solid var(--color-border)', height: '100%' }}>
                        <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <MuiTypography variant="h6" sx={{ fontWeight: 700 }}>تقويم الحجوزات</MuiTypography>
                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <MuiIconButton onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}><ChevronRight size={20} /></MuiIconButton>
                                <MuiTypography sx={{ fontWeight: 600 }}>{currentMonth.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' })}</MuiTypography>
                                <MuiIconButton onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}><ChevronLeft size={20} /></MuiIconButton>
                            </MuiBox>
                        </MuiBox>
                        <MuiGrid container spacing={1}>
                            {['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map(d => (
                                <MuiGrid item xs={1.71} key={d} sx={{ textAlign: 'center', p: 1 }}>
                                    <MuiTypography variant="caption" sx={{ fontWeight: 700, color: 'var(--color-text-secondary)' }}>{d}</MuiTypography>
                                </MuiGrid>
                            ))}
                            {calendarDays.map((date, i) => {
                                const event = getDayEvent(date)
                                return (
                                    <MuiGrid item xs={1.71} key={i} sx={{ p: 0.5 }}>
                                        <MuiBox 
                                            onClick={() => event && openViewDialog(event)}
                                            sx={{ 
                                                height: 80, 
                                                borderRadius: '12px', 
                                                border: '1px solid var(--color-border)', 
                                                bgcolor: event ? 'rgba(216, 185, 138, 0.1)' : 'transparent',
                                                p: 1,
                                                position: 'relative',
                                                cursor: event ? 'pointer' : 'default',
                                                '&:hover': { bgcolor: event ? 'rgba(216, 185, 138, 0.2)' : 'rgba(255,255,255,0.02)' }
                                            }}
                                        >
                                            <MuiTypography variant="caption" sx={{ fontWeight: 700, color: date ? 'var(--color-text-primary)' : 'transparent' }}>{date?.getDate()}</MuiTypography>
                                            {event && (
                                                <MuiBox sx={{ mt: 0.5 }}>
                                                    <MuiTypography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--color-icon)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.name}</MuiTypography>
                                                    <MuiTypography variant="caption" sx={{ fontSize: '0.6rem', color: 'var(--color-text-secondary)' }}>{event.startTime || 'مساءً'}</MuiTypography>
                                                </MuiBox>
                                            )}
                                        </MuiBox>
                                    </MuiGrid>
                                )
                            })}
                        </MuiGrid>
                    </MuiPaper>
                </MuiGrid>

                {/* Reminders & Recent Transactions */}
                <MuiGrid item xs={12} lg={4}>
                    <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
                        {/* Reminders */}
                        <MuiPaper sx={{ p: 3, borderRadius: '24px', background: 'var(--color-paper)', border: '1px solid var(--color-border)' }}>
                            <MuiTypography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AlertCircle size={20} color="var(--color-icon)" /> تذكيرات هامة
                            </MuiTypography>
                            <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {[
                                    { text: 'حجز يوم الخميس يحتاج تأكيد قائمة الطعام', time: 'منذ ساعتين', color: '#ff9800' },
                                    { text: 'هناك 3 مبالغ متبقية تستحق التحصيل اليوم', time: 'منذ 5 ساعات', color: '#f44336' },
                                    { text: 'تم تحديث قالب العقد بنجاح', time: 'بالأمس', color: '#4caf50' }
                                ].map((r, i) => (
                                    <MuiBox key={i} sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.02)', borderRight: `4px solid ${r.color}` }}>
                                        <MuiTypography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{r.text}</MuiTypography>
                                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>{r.time}</MuiTypography>
                                    </MuiBox>
                                ))}
                            </MuiBox>
                        </MuiPaper>

                        {/* Recent Transactions */}
                        <MuiPaper sx={{ p: 3, borderRadius: '24px', background: 'var(--color-paper)', border: '1px solid var(--color-border)', flex: 1 }}>
                            <MuiTypography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>آخر العمليات المالية</MuiTypography>
                            <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {recentActivity?.events?.slice(0, 4).map((e, i) => (
                                    <MuiBox key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }} onClick={() => openViewDialog(e)}>
                                        <MuiAvatar sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' }}><DollarSign size={20} /></MuiAvatar>
                                        <MuiBox sx={{ flex: 1 }}>
                                            <MuiTypography variant="body2" sx={{ fontWeight: 700 }}>{e.name}</MuiTypography>
                                            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>{formatDate(e.date)}</MuiTypography>
                                        </MuiBox>
                                        <MuiTypography variant="body2" sx={{ fontWeight: 800, color: '#4caf50' }}>+{formatCurrency(e.paidAmount || 0)}</MuiTypography>
                                    </MuiBox>
                                ))}
                            </MuiBox>
                        </MuiPaper>
                    </MuiBox>
                </MuiGrid>

                {/* Upcoming Events List */}
                <MuiGrid item xs={12}>
                    <MuiPaper sx={{ p: 3, borderRadius: '24px', background: 'var(--color-paper)', border: '1px solid var(--color-border)' }}>
                        <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <MuiTypography variant="h6" sx={{ fontWeight: 700 }}>المناسبات الخمسة القادمة</MuiTypography>
                            <MuiButton size="small" endIcon={<ChevronLeft size={16} />}>عرض الكل</MuiButton>
                        </MuiBox>
                        <MuiGrid container spacing={2}>
                            {recentActivity?.events?.slice(0, 5).map((e, i) => (
                                <MuiGrid item xs={12} md={2.4} key={i}>
                                    <MuiBox 
                                        onClick={() => openViewDialog(e)}
                                        sx={{ 
                                            p: 2, 
                                            borderRadius: '16px', 
                                            border: '1px solid var(--color-border)', 
                                            bgcolor: 'rgba(255,255,255,0.01)',
                                            cursor: 'pointer',
                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' }
                                        }}
                                    >
                                        <MuiTypography variant="body2" sx={{ fontWeight: 700, mb: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.name}</MuiTypography>
                                        <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                                                <Calendar size={14} /> <MuiTypography variant="caption">{formatDate(e.date)}</MuiTypography>
                                            </MuiBox>
                                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                                                <Users size={14} /> <MuiTypography variant="caption">{e.guestCount} ضيف</MuiTypography>
                                            </MuiBox>
                                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CheckCircle size={14} color={e.paidAmount >= e.totalPrice ? '#4caf50' : '#ff9800'} />
                                                <MuiTypography variant="caption" sx={{ fontWeight: 600 }}>{e.paidAmount >= e.totalPrice ? 'مدفوع بالكامل' : 'دفع جزئي'}</MuiTypography>
                                            </MuiBox>
                                        </MuiBox>
                                    </MuiBox>
                                </MuiGrid>
                            ))}
                        </MuiGrid>
                    </MuiPaper>
                </MuiGrid>
            </MuiGrid>

            <ViewEventDialog
                open={isView}
                onClose={closeDialog}
                event={selectedEvent}
            />
        </MuiBox>
    )
}
