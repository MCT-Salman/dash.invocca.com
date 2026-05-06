// src\pages\client\ClientDashboard.jsx
import { useQuery } from '@tanstack/react-query'
import { useMemo, useEffect } from 'react'
import MuiBox from '@/components/ui/MuiBox'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiChip from '@/components/ui/MuiChip'
import MuiAvatar from '@/components/ui/MuiAvatar'
import MuiButton from '@/components/ui/MuiButton'
import { LoadingScreen, SEOHead, EmptyState } from '@/components/common'
import { QUERY_KEYS } from '@/config/constants'
import { getClientReports, getClientDashboard } from '@/api/client'
import { formatNumber, formatDate, formatCurrency } from '@/utils/helpers'
import { useAuth } from '@/hooks'
import { useClient } from '@/providers/ClientProvider'
import ClientEventSelector from './components/ClientEventSelector'
import {
    LayoutDashboard,
    Calendar,
    CheckCircle,
    Clock,
    Users,
    DollarSign,
    Building2,
    MapPin,
    AlertCircle,
    ChevronLeft
} from 'lucide-react'

const StatCard = ({ title, value, icon: Icon }) => (
    <MuiPaper
        elevation={0}
        sx={{
            p: 3,
            height: '100%',
            background: 'var(--color-paper)',
            border: '1px solid var(--color-border-glass)',
            borderRadius: '24px',
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-4px)',
                borderColor: 'var(--color-icon)',
            }
        }}
    >
        <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <MuiBox>
                <MuiTypography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>{value}</MuiTypography>
                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>{title}</MuiTypography>
            </MuiBox>
            <MuiBox
                sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-icon)',
                    border: '1px solid var(--color-border)'
                }}
            >
                <Icon size={24} />
            </MuiBox>
        </MuiBox>
    </MuiPaper>
)

export default function ClientDashboard() {
    const { user } = useAuth()
    const { selectedEventId, selectEvent, selectedEvent, setSelectedEvent } = useClient()

    const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
        queryKey: QUERY_KEYS.CLIENT_DASHBOARD,
        queryFn: getClientDashboard,
    })

    const { data: reportData, isLoading: reportLoading, error } = useQuery({
        queryKey: [QUERY_KEYS.CLIENT_REPORTS, selectedEventId],
        queryFn: () => getClientReports({ eventId: selectedEventId }),
        enabled: !!selectedEventId
    })

    const allEvents = useMemo(() => {
        const d = dashboardData?.data || dashboardData || {}
        return d.allEvents || d.events || []
    }, [dashboardData])

    // Validate selected event against available events
    useEffect(() => {
        if (!dashboardLoading && allEvents.length > 0) {
            if (selectedEventId) {
                const ev = allEvents.find(e => (e._id || e.id) === selectedEventId)
                if (ev) {
                    setSelectedEvent(ev)
                } else {
                    // Stale or invalid ID, clear it
                    selectEvent(null)
                }
            }
        }
    }, [selectedEventId, allEvents, dashboardLoading, setSelectedEvent, selectEvent])

    if (dashboardLoading) return <LoadingScreen />

    // If no events at all, show empty state
    if (allEvents.length === 0) {
        return (
            <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
                <SEOHead title="لوحة التحكم | INVOCCA" />
                <EmptyState 
                    title="لا توجد مناسبات حالياً" 
                    description="لم يتم العثور على أي مناسبات مسجلة باسمك. يرجى التواصل مع إدارة القاعة."
                    icon={Calendar}
                />
            </MuiBox>
        )
    }

    if (!selectedEventId) {
        return (
            <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
                <SEOHead title="اختيار المناسبة | INVOCCA" />
                <ClientEventSelector events={allEvents} />
            </MuiBox>
        )
    }

    const eventData = reportData?.data || reportData || {}
    const event = selectedEvent || eventData.event
    const invitations = eventData.invitations || []

    const stats = {
        totalInvitations: invitations.length,
        totalGuests: invitations.reduce((sum, inv) => sum + (inv.numOfPeople || 0), 0),
        totalSpent: event?.totalPrice || 0,
        totalPaid: event?.paidAmount || 0,
        totalUnpaid: event?.remainingBalance || (event?.totalPrice || 0) - (event?.paidAmount || 0),
    }

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
            <SEOHead title={`لوحة التحكم - ${event?.name || 'المناسبة'} | INVOCCA`} />

            {/* Header with Switch Button */}
            <MuiBox sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <MuiBox>
                    <MuiTypography variant="h4" sx={{ fontWeight: 900, color: 'var(--color-icon)', mb: 1 }}>
                        {event?.name || 'لوحة التحكم'}
                    </MuiTypography>
                    <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
                        مرحباً بك مجدداً، {user?.name}
                    </MuiTypography>
                </MuiBox>
                <MuiButton 
                    variant="outlined" 
                    startIcon={<ChevronLeft />} 
                    onClick={() => selectEvent(null)}
                    sx={{ borderRadius: '12px', borderColor: 'var(--color-border)' }}
                >
                    تغيير المناسبة
                </MuiButton>
            </MuiBox>

            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard title="إجمالي الدعوات" value={stats.totalInvitations} icon={Users} />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard title="إجمالي الضيوف" value={stats.totalGuests} icon={Users} />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard title="المدفوع" value={formatCurrency(stats.totalPaid)} icon={DollarSign} />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard title="المتبقي" value={formatCurrency(stats.totalUnpaid)} icon={Clock} />
                </MuiGrid>
            </MuiGrid>

            <MuiGrid container spacing={3}>
                <MuiGrid item xs={12} md={8}>
                    <MuiPaper sx={{ p: 4, borderRadius: '24px', background: 'var(--color-paper)', border: '1px solid var(--color-border)' }}>
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                            <Building2 size={24} style={{ color: 'var(--color-icon)' }} />
                            <MuiTypography variant="h6" sx={{ fontWeight: 700 }}>معلومات الفعالية</MuiTypography>
                        </MuiBox>
                        
                        <MuiGrid container spacing={3}>
                            <MuiGrid item xs={12} sm={6}>
                                <MuiBox sx={{ p: 2, borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border-glass)' }}>
                                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 0.5 }}>التاريخ</MuiTypography>
                                    <MuiTypography variant="body1" sx={{ fontWeight: 700 }}>{formatDate(event?.date || event?.eventDate)}</MuiTypography>
                                </MuiBox>
                            </MuiGrid>
                            <MuiGrid item xs={12} sm={6}>
                                <MuiBox sx={{ p: 2, borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border-glass)' }}>
                                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 0.5 }}>الموقع</MuiTypography>
                                    <MuiTypography variant="body1" sx={{ fontWeight: 700 }}>{event?.hallId?.name || '—'}</MuiTypography>
                                </MuiBox>
                            </MuiGrid>
                            <MuiGrid item xs={12} sm={6}>
                                <MuiBox sx={{ p: 2, borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border-glass)' }}>
                                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 0.5 }}>السعة</MuiTypography>
                                    <MuiTypography variant="body1" sx={{ fontWeight: 700 }}>{event?.capacity || 0} ضيف</MuiTypography>
                                </MuiBox>
                            </MuiGrid>
                            <MuiGrid item xs={12} sm={6}>
                                <MuiBox sx={{ p: 2, borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border-glass)' }}>
                                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 0.5 }}>حالة الحجز</MuiTypography>
                                    <MuiChip label="مؤكد" color="success" size="small" sx={{ fontWeight: 700 }} />
                                </MuiBox>
                            </MuiGrid>
                        </MuiGrid>
                    </MuiPaper>
                </MuiGrid>

                <MuiGrid item xs={12} md={4}>
                    <MuiPaper sx={{ p: 4, borderRadius: '24px', background: 'var(--color-paper)', border: '1px solid var(--color-border)', height: '100%' }}>
                        <MuiTypography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>تذكيرات هامة</MuiTypography>
                        <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <MuiBox sx={{ p: 2, borderRadius: '12px', border: '1px solid var(--color-border)', display: 'flex', gap: 2 }}>
                                <AlertCircle size={20} style={{ color: 'var(--color-icon)' }} />
                                <MuiTypography variant="body2">يرجى تأكيد قائمة الطعام قبل موعد الحفلة بـ 7 أيام.</MuiTypography>
                            </MuiBox>
                            <MuiBox sx={{ p: 2, borderRadius: '12px', border: '1px solid var(--color-border)', display: 'flex', gap: 2 }}>
                                <Clock size={20} style={{ color: 'var(--color-icon)' }} />
                                <MuiTypography variant="body2">بانتظار سداد الدفعة الأخيرة.</MuiTypography>
                            </MuiBox>
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>
            </MuiGrid>
        </MuiBox>
    )
}
