// src\pages\client\ClientReports.jsx
import { useQuery } from '@tanstack/react-query'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiDivider from '@/components/ui/MuiDivider'
import { LoadingScreen, SEOHead, EmptyState } from '@/components/common'
import { QUERY_KEYS } from '@/config/constants'
import { getClientReports } from '@/api/client'
import { formatDate, formatCurrency } from '@/utils/helpers'
import {
    BarChart3,
    Calendar,
    Users,
    DollarSign,
    FileText,
    CheckCircle,
    AlertCircle
} from 'lucide-react'

export default function ClientReports() {
    const { data, isLoading, error } = useQuery({
        queryKey: QUERY_KEYS.CLIENT_REPORTS,
        queryFn: getClientReports,
    })

    const responseData = data?.data || data || {}
    const hasEvent = responseData.hasEvent
    const event = responseData.event
    const invitations = responseData.invitations || []

    if (isLoading) return <LoadingScreen />
    if (error) return <EmptyState title="حدث خطأ" description={error.message} icon={AlertCircle} />

    if (!hasEvent || !event) {
        return (
            <MuiBox sx={{ p: 4, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
                <SEOHead title="التقارير | INVOCCA" />
                <MuiTypography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>التقارير والإحصائيات</MuiTypography>
                <EmptyState
                    title="لا توجد بيانات"
                    description="ستظهر تقاريرك المالية وإحصائيات مناسباتك هنا عند توفرها."
                    icon={BarChart3}
                />
            </MuiBox>
        )
    }

    const stats = {
        totalPrice: event.totalPrice || 0,
        paidAmount: event.paidAmount || 0,
        remaining: event.remainingBalance || ((event.totalPrice || 0) - (event.paidAmount || 0)),
        invitationCount: invitations.length,
        guestCount: event.guestCount || 0
    }

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
            <SEOHead title="التقارير | INVOCCA" />
            
            <MuiBox sx={{ mb: 4 }}>
                <MuiTypography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>التقارير والإحصائيات</MuiTypography>
                <MuiTypography variant="body1" sx={{ color: 'var(--color-icon)' }}>تقرير مفصل لمناسبتك: {event.name}</MuiTypography>
            </MuiBox>

            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                {/* Financial Summary */}
                <MuiGrid item xs={12} md={6}>
                    <MuiPaper sx={{ p: 3, borderRadius: '24px', background: 'var(--color-paper)', border: '1px solid var(--color-border)' }}>
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <DollarSign size={20} style={{ color: 'var(--color-icon)' }} />
                            <MuiTypography variant="h6" sx={{ fontWeight: 700 }}>الملخص المالي</MuiTypography>
                        </MuiBox>
                        <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>إجمالي التكلفة</MuiTypography>
                                <MuiTypography variant="body2" sx={{ fontWeight: 700 }}>{formatCurrency(stats.totalPrice)}</MuiTypography>
                            </MuiBox>
                            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <MuiTypography variant="body2" sx={{ color: '#22c55e' }}>المبلغ المدفوع</MuiTypography>
                                <MuiTypography variant="body2" sx={{ fontWeight: 700, color: '#22c55e' }}>{formatCurrency(stats.paidAmount)}</MuiTypography>
                            </MuiBox>
                            <MuiDivider sx={{ my: 1 }} />
                            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <MuiTypography variant="body2" sx={{ color: '#ef4444' }}>المبلغ المتبقي</MuiTypography>
                                <MuiTypography variant="body2" sx={{ fontWeight: 800, color: '#ef4444' }}>{formatCurrency(stats.remaining)}</MuiTypography>
                            </MuiBox>
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>

                {/* Invitations Summary */}
                <MuiGrid item xs={12} md={6}>
                    <MuiPaper sx={{ p: 3, borderRadius: '24px', background: 'var(--color-paper)', border: '1px solid var(--color-border)' }}>
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <FileText size={20} style={{ color: 'var(--color-icon)' }} />
                            <MuiTypography variant="h6" sx={{ fontWeight: 700 }}>إحصائيات الدعوات</MuiTypography>
                        </MuiBox>
                        <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>عدد الدعوات المرسلة</MuiTypography>
                                <MuiTypography variant="body2" sx={{ fontWeight: 700 }}>{stats.invitationCount}</MuiTypography>
                            </MuiBox>
                            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>عدد الضيوف المتوقع</MuiTypography>
                                <MuiTypography variant="body2" sx={{ fontWeight: 700 }}>{stats.guestCount}</MuiTypography>
                            </MuiBox>
                            <MuiDivider sx={{ my: 1 }} />
                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CheckCircle size={16} style={{ color: 'var(--color-icon)' }} />
                                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>تحديث تلقائي عند مسح كود الدعوة</MuiTypography>
                            </MuiBox>
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>
            </MuiGrid>
        </MuiBox>
    )
}
