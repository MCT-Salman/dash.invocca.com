// src\pages\manager\ManagerFinancialDashboard.jsx
import { useQuery } from '@tanstack/react-query'
import { getFinancialDashboard } from '@/api/manager'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiButton from '@/components/ui/MuiButton'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiChip from '@/components/ui/MuiChip'
import { SEOHead, LoadingScreen } from '@/components/common'
import { useNavigate } from 'react-router-dom'
import { DollarSign, Receipt, AlertCircle, ArrowUpRight, ArrowDownRight, Wallet, Activity, TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency, formatDate } from '@/utils/helpers'

export default function ManagerFinancialDashboard() {
    const navigate = useNavigate()
    const { data, isLoading } = useQuery({
        queryKey: ['financial-dashboard'],
        queryFn: getFinancialDashboard,
    })

    if (isLoading) return <LoadingScreen message="جاري تحميل البيانات المالية..." />

    const summary = data?.summary || {}
    const currentMonth = summary?.currentMonth || {}
    const invoices = summary?.invoices || {}
    const recentTransactions = data?.recentTransactions || []
    const overdueInvoices = data?.overdueInvoices || []

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
            <SEOHead title="لوحة التحكم المالية | INVOCCA" />

            <MuiBox sx={{ mb: 4, textAlign: 'center' }}>
                <MuiTypography variant="h3" sx={{ fontWeight: 800, color: 'var(--color-icon)', mb: 1 }}>لوحة التحكم المالية</MuiTypography>
                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>نظرة شاملة على الأداء المالي والعمليات الحالية</MuiTypography>
            </MuiBox>

            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard title="إجمالي الإيرادات" value={formatCurrency(currentMonth.totalRevenue || 0)} icon={DollarSign} trend="up" />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard title="إجمالي المصاريف" value={formatCurrency(currentMonth.totalExpenses || 0)} icon={TrendingDown} trend="down" />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard title="صافي الربح" value={formatCurrency(currentMonth.netProfit || 0)} icon={Wallet} trend={currentMonth.netProfit >= 0 ? 'up' : 'down'} />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard title="عدد العمليات" value={currentMonth.transactionCount || 0} icon={Activity} />
                </MuiGrid>
            </MuiGrid>

            <MuiGrid container spacing={3}>
                <MuiGrid item xs={12} md={6}>
                    <MuiPaper sx={{ p: 3, borderRadius: '24px', background: 'var(--color-paper)', border: '1px solid var(--color-border)' }}>
                        <MuiTypography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-icon)', mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Receipt size={24} /> ملخص الفواتير
                        </MuiTypography>
                        <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <InfoRow label="إجمالي الفواتير" value={invoices.totalInvoices || 0} />
                            <InfoRow label="المبلغ الإجمالي" value={formatCurrency(invoices.totalAmount || 0)} />
                            <InfoRow label="المبلغ المدفوع" value={formatCurrency(invoices.totalPaid || 0)} color="#22c55e" />
                            <InfoRow label="المبلغ المتبقي" value={formatCurrency(invoices.totalOutstanding || 0)} color="#ef4444" />
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>

                <MuiGrid item xs={12} md={6}>
                    <MuiPaper sx={{ p: 3, borderRadius: '24px', background: 'var(--color-paper)', border: '1px solid var(--color-border)' }}>
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <AlertCircle size={24} style={{ color: '#ef4444' }} />
                            <MuiTypography variant="h6" sx={{ fontWeight: 700 }}>فواتير متأخرة</MuiTypography>
                        </MuiBox>
                        {overdueInvoices.length === 0 ? (
                            <MuiTypography variant="body2" sx={{ textAlign: 'center', py: 4, color: 'var(--color-text-secondary)' }}>لا توجد فواتير متأخرة حالياً</MuiTypography>
                        ) : (
                            <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <InfoRow label="عدد الفواتير" value={invoices.overdueCount || 0} color="#ef4444" />
                                <InfoRow label="المبلغ المتأخر" value={formatCurrency(invoices.overdueAmount || 0)} color="#ef4444" />
                                <MuiButton variant="outlined" color="error" fullWidth onClick={() => navigate('/manager/financial/invoices')}>عرض التفاصيل</MuiButton>
                            </MuiBox>
                        )}
                    </MuiPaper>
                </MuiGrid>
            </MuiGrid>
        </MuiBox>
    )
}

function StatCard({ title, value, icon: Icon, trend }) {
    return (
        <MuiPaper sx={{ p: 3, borderRadius: '24px', background: 'var(--color-paper)', border: '1px solid var(--color-border)', height: '100%' }}>
            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <MuiBox sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(216, 185, 138, 0.1)', color: 'var(--color-icon)' }}>
                    <Icon size={24} />
                </MuiBox>
                {trend && (
                    <MuiChip 
                        size="small" 
                        icon={trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} 
                        label={trend === 'up' ? 'صعود' : 'هبوط'} 
                        sx={{ bgcolor: trend === 'up' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: trend === 'up' ? '#22c55e' : '#ef4444', fontWeight: 700 }}
                    />
                )}
            </MuiBox>
            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>{title}</MuiTypography>
            <MuiTypography variant="h5" sx={{ fontWeight: 800 }}>{value}</MuiTypography>
        </MuiPaper>
    )
}

function InfoRow({ label, value, color }) {
    return (
        <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>{label}</MuiTypography>
            <MuiTypography variant="body2" sx={{ fontWeight: 700, color: color || 'var(--color-text-primary)' }}>{value}</MuiTypography>
        </MuiBox>
    )
}
