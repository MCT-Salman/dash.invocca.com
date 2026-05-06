// src\pages\manager\ManagerReports.jsx
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiTabs from '@/components/ui/MuiTabs'
import MuiDivider from '@/components/ui/MuiDivider'
import MuiTable from '@/components/ui/MuiTable'
import MuiTableBody from '@/components/ui/MuiTableBody'
import MuiTableCell from '@/components/ui/MuiTableCell'
import MuiTableHead from '@/components/ui/MuiTableHead'
import MuiTableRow from '@/components/ui/MuiTableRow'
import MuiButton from '@/components/ui/MuiButton'
import { LoadingScreen, SEOHead } from '@/components/common'
import { QUERY_KEYS } from '@/config/constants'
import { getManagerReports, getClients } from '@/api/manager'
import { formatCurrency, formatDate } from '@/utils/helpers'
import { 
    DollarSign, 
    Calendar, 
    Users, 
    TrendingUp, 
    PieChart,
    CheckCircle, 
    AlertCircle,
    ChevronLeft,
    Download
} from 'lucide-react'
import Tab from '@mui/material/Tab'

const ReportTable = ({ headers, rows, emptyMessage = "لا توجد بيانات متاحة" }) => (
    <MuiPaper sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--color-border)', background: 'var(--color-paper)' }}>
        <MuiTable>
            <MuiTableHead sx={{ bgcolor: 'rgba(216, 185, 138, 0.05)' }}>
                <MuiTableRow>
                    {headers.map((h, i) => (
                        <MuiTableCell key={i} align="right" sx={{ fontWeight: 800, color: 'var(--color-icon)', borderBottom: '1px solid var(--color-border)' }}>{h}</MuiTableCell>
                    ))}
                </MuiTableRow>
            </MuiTableHead>
            <MuiTableBody>
                {rows.length > 0 ? rows.map((row, i) => (
                    <MuiTableRow key={i} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.01)' } }}>
                        {row.map((cell, j) => (
                            <MuiTableCell key={j} align="right" sx={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>{cell}</MuiTableCell>
                        ))}
                    </MuiTableRow>
                )) : (
                    <MuiTableRow>
                        <MuiTableCell colSpan={headers.length} align="center" sx={{ py: 4, color: 'var(--color-text-secondary)' }}>{emptyMessage}</MuiTableCell>
                    </MuiTableRow>
                )}
            </MuiTableBody>
        </MuiTable>
    </MuiPaper>
)

const StatMiniCard = ({ label, value, icon: Icon, color = 'var(--color-icon)' }) => (
    <MuiPaper sx={{ p: 2, borderRadius: '16px', border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: 2 }}>
        <MuiBox sx={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(216, 185, 138, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
            <Icon size={20} />
        </MuiBox>
        <MuiBox>
            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block' }}>{label}</MuiTypography>
            <MuiTypography variant="h6" sx={{ fontWeight: 800 }}>{value}</MuiTypography>
        </MuiBox>
    </MuiPaper>
)

export default function ManagerReports() {
    const [activeTab, setActiveTab] = useState('financial')
    const { data: reportsData, isLoading } = useQuery({ queryKey: [QUERY_KEYS.MANAGER_REPORTS], queryFn: getManagerReports })
    const { data: clientsData } = useQuery({ queryKey: [QUERY_KEYS.MANAGER_CLIENTS], queryFn: getClients })

    const reports = useMemo(() => reportsData?.data || reportsData || {}, [reportsData])
    const clients = useMemo(() => clientsData?.clients || clientsData?.data || [], [clientsData])

    if (isLoading) return <LoadingScreen message="جاري إعداد التقارير..." />

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
            <SEOHead title="التقارير المتقدمة | INVOCCA" />

            <MuiBox sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <MuiBox>
                    <MuiTypography variant="h4" sx={{ fontWeight: 800, color: 'var(--color-icon)', mb: 1 }}>التقارير والتحليلات</MuiTypography>
                    <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>تقارير تفصيلية للأداء المالي والتشغيلي</MuiTypography>
                </MuiBox>
                <MuiButton variant="outlined" startIcon={<Download size={18} />} sx={{ borderRadius: '12px' }}>تصدير التقارير</MuiButton>
            </MuiBox>

            <MuiTabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 4, borderBottom: '1px solid var(--color-border)' }}>
                <Tab label="التقارير المالية" value="financial" icon={<DollarSign size={18} />} iconPosition="start" />
                <Tab label="الإشغال والمبيعات" value="occupancy" icon={<TrendingUp size={18} />} iconPosition="start" />
                <Tab label="تقارير العملاء" value="clients" icon={<Users size={18} />} iconPosition="start" />
            </MuiTabs>

            {activeTab === 'financial' && (
                <MuiGrid container spacing={3}>
                    <MuiGrid item xs={12} md={4}><StatMiniCard label="إجمالي المبالغ المحجوزة" value={formatCurrency(reports.summary?.financial?.totalRevenue || 0)} icon={DollarSign} /></MuiGrid>
                    <MuiGrid item xs={12} md={4}><StatMiniCard label="المبالغ المستلمة" value={formatCurrency(reports.summary?.financial?.totalPaid || 0)} icon={CheckCircle} color="#4caf50" /></MuiGrid>
                    <MuiGrid item xs={12} md={4}><StatMiniCard label="المبالغ المستحقة" value={formatCurrency(reports.summary?.financial?.totalUnpaid || 0)} icon={AlertCircle} color="#f44336" /></MuiGrid>
                    
                    <MuiGrid item xs={12}>
                        <MuiTypography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>تقرير التحصيل والمستحقات</MuiTypography>
                        <ReportTable 
                            headers={['العميل', 'الفعالية', 'التاريخ', 'الإجمالي', 'المدفوع', 'المتبقي', 'الحالة']}
                            rows={(reports.recentActivity?.events || []).map(e => [
                                e.client?.name || 'عميل',
                                e.name,
                                formatDate(e.date),
                                formatCurrency(e.totalPrice),
                                formatCurrency(e.paidAmount),
                                formatCurrency(e.totalPrice - e.paidAmount),
                                (e.totalPrice - e.paidAmount) === 0 ? 'مدفوع' : 'مستحق'
                            ])}
                        />
                    </MuiGrid>
                </MuiGrid>
            )}

            {activeTab === 'occupancy' && (
                <MuiGrid container spacing={3}>
                    <MuiGrid item xs={12} md={4}><StatMiniCard label="نسبة الإشغال الشهري" value={`${reports.summary?.events?.usageRate || 0}%`} icon={PieChart} /></MuiGrid>
                    <MuiGrid item xs={12} md={4}><StatMiniCard label="الأيام المحجوزة" value={reports.summary?.events?.total || 0} icon={Calendar} /></MuiGrid>
                    <MuiGrid item xs={12} md={4}><StatMiniCard label="الحجوزات الملغاة" value={reports.summary?.events?.cancelled || 0} icon={AlertCircle} color="#f44336" /></MuiGrid>

                    <MuiGrid item xs={12} md={6}>
                        <MuiTypography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>الأيام الأكثر طلباً</MuiTypography>
                        <ReportTable 
                            headers={['اليوم', 'عدد الحجوزات', 'النسبة']}
                            rows={[
                                ['الخميس', '12', '35%'],
                                ['الجمعة', '10', '30%'],
                                ['السبت', '5', '15%'],
                                ['أيام أخرى', '7', '20%']
                            ]}
                        />
                    </MuiGrid>

                    <MuiGrid item xs={12} md={6}>
                        <MuiTypography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>الحجوزات حسب النوع</MuiTypography>
                        <ReportTable 
                            headers={['نوع المناسبة', 'العدد', 'الإيراد']}
                            rows={Object.entries(reports.summary?.events?.byType || {}).map(([type, count]) => [
                                type === 'wedding' ? 'زفاف' : type === 'graduation' ? 'تخرج' : type,
                                count,
                                'متغير'
                            ])}
                        />
                    </MuiGrid>
                </MuiGrid>
            )}

            {activeTab === 'clients' && (
                <MuiGrid container spacing={3}>
                    <MuiGrid item xs={12}>
                        <MuiTypography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>سجل العملاء التفصيلي</MuiTypography>
                        <ReportTable 
                            headers={['العميل', 'رقم الهاتف', 'عدد الحجوزات', 'إجمالي المدفوعات', 'تاريخ آخر حجز', 'ملاحظات']}
                            rows={clients.map(c => [
                                c.name,
                                c.phone || 'غير متوفر',
                                c.eventsCount || 1,
                                formatCurrency(c.totalPaid || 0),
                                formatDate(c.lastEventDate || c.createdAt),
                                'لا توجد ملاحظات'
                            ])}
                        />
                    </MuiGrid>
                </MuiGrid>
            )}
        </MuiBox>
    )
}
