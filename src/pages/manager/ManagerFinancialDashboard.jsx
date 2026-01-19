// src/pages/manager/ManagerFinancialDashboard.jsx
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getFinancialDashboard } from '@/api/manager'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiButton from '@/components/ui/MuiButton'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiChip from '@/components/ui/MuiChip'
import { SEOHead, LoadingScreen, EmptyState } from '@/components/common'
import { useNavigate } from 'react-router-dom'
import { DollarSign, TrendingUp, TrendingDown, Receipt, AlertCircle, ArrowUpRight, ArrowDownRight, Wallet, Activity } from 'lucide-react'
import { formatCurrency, formatDate } from '@/utils/helpers'

export default function ManagerFinancialDashboard() {
    const navigate = useNavigate()
    const { data, isLoading } = useQuery({
        queryKey: ['financial-dashboard'],
        queryFn: getFinancialDashboard,
    })

    if (isLoading) {
        return <LoadingScreen message="جاري تحميل لوحة التحكم المالية..." fullScreen={false} />
    }

    const summary = data?.summary || {}
    const currentMonth = summary?.currentMonth || {}
    const invoices = summary?.invoices || {}
    const recentTransactions = data?.recentTransactions || []
    const overdueInvoices = data?.overdueInvoices || []
    const monthlyTrend = data?.monthlyTrend || []

    return (
        <MuiBox sx={{
            p: { xs: 2, sm: 3 },
            minHeight: '100vh',
            background: 'radial-gradient(circle at 50% 0%, rgba(216, 185, 138, 0.05) 0%, rgba(0, 0, 0, 0) 70%)'
        }}>
            <SEOHead title="لوحة التحكم المالية | INVOCCA" />

            {/* Header */}
            <MuiBox sx={{ mb: 4, textAlign: 'center' }}>
                <MuiTypography variant="h3" sx={{
                    fontWeight: 800,
                    color: 'var(--color-primary-500)',
                    mb: 1,
                    textShadow: '0 0 30px rgba(216, 185, 138, 0.2)',
                    background: 'linear-gradient(135deg, #D49B55 0%, #F5DEB3 50%, #D49B55 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    لوحة التحكم المالية
                </MuiTypography>
                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
                    نظرة شاملة على الأداء المالي والعمليات الحالية
                </MuiTypography>
            </MuiBox>

            {/* Summary Cards */}
            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                {/* Total Revenue */}
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="إجمالي الإيرادات"
                        value={formatCurrency(currentMonth.totalRevenue || 0)}
                        icon={DollarSign}
                        color="#22c55e"
                        bgColor="rgba(34, 197, 94, 0.1)"
                        trend="up"
                    />
                </MuiGrid>

                {/* Total Expenses */}
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="إجمالي المصروفات"
                        value={formatCurrency(currentMonth.totalExpenses || 0)}
                        icon={TrendingDown}
                        color="#ef4444"
                        bgColor="rgba(239, 68, 68, 0.1)"
                        trend="down"
                    />
                </MuiGrid>

                {/* Net Profit */}
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="صافي الربح"
                        value={formatCurrency(currentMonth.netProfit || 0)}
                        icon={Wallet}
                        color="var(--color-primary-500)"
                        bgColor="rgba(216, 185, 138, 0.1)"
                        trend={currentMonth.netProfit >= 0 ? 'up' : 'down'}
                    />
                </MuiGrid>

                {/* Transaction Count */}
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="عدد المعاملات"
                        value={currentMonth.transactionCount || 0}
                        icon={Activity}
                        color="#3b82f6"
                        bgColor="rgba(59, 130, 246, 0.1)"
                        trend="neutral"
                    />
                </MuiGrid>
            </MuiGrid>

            {/* Invoice Summary & Overdue Alerts */}
            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                {/* Invoice Summary */}
                <MuiGrid item xs={12} md={6}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            p: 3,
                            background: 'rgba(20, 20, 20, 0.6)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(216, 185, 138, 0.15)',
                            borderRadius: '24px',
                            height: '100%',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                                borderColor: 'rgba(216, 185, 138, 0.3)'
                            }
                        }}
                    >
                        <MuiTypography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-primary-500)', mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Receipt size={24} />
                            ملخص الفواتير
                        </MuiTypography>
                        <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <InfoRow label="إجمالي الفواتير" value={invoices.totalInvoices || 0} />
                            <InfoRow label="المبلغ الإجمالي" value={formatCurrency(invoices.totalAmount || 0)} />
                            <InfoRow label="المدفوع" value={formatCurrency(invoices.totalPaid || 0)} color="#22c55e" />
                            <InfoRow label="المتبقي" value={formatCurrency(invoices.totalOutstanding || 0)} color="#f59e0b" />
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>

                {/* Overdue Invoices Alert */}
                <MuiGrid item xs={12} md={6}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            p: 3,
                            background: overdueInvoices.length > 0 ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(20, 20, 20, 0.6) 100%)' : 'rgba(20, 20, 20, 0.6)',
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${overdueInvoices.length > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(216, 185, 138, 0.15)'}`,
                            borderRadius: '24px',
                            height: '100%',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                                borderColor: overdueInvoices.length > 0 ? 'rgba(239, 68, 68, 0.5)' : 'rgba(216, 185, 138, 0.3)'
                            }
                        }}
                    >
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <AlertCircle size={24} style={{ color: overdueInvoices.length > 0 ? '#ef4444' : '#22c55e' }} />
                            <MuiTypography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-primary-500)' }}>
                                فواتير متأخرة
                            </MuiTypography>
                        </MuiBox>
                        {overdueInvoices.length === 0 ? (
                            <MuiBox sx={{ textAlign: 'center', py: 2 }}>
                                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)', mb: 1 }}>
                                    ممتاز! لا توجد فواتير متأخرة
                                </MuiTypography>
                                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-disabled)' }}>
                                    جميع المدفوعات في موعدها ✅
                                </MuiTypography>
                            </MuiBox>
                        ) : (
                            <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                <InfoRow label="عدد الفواتير المتأخرة" value={invoices.overdueCount || 0} color="#ef4444" />
                                <InfoRow label="المبلغ المتأخر" value={formatCurrency(invoices.overdueAmount || 0)} color="#ef4444" />
                                <MuiButton
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    sx={{ mt: 1, borderRadius: '10px' }}
                                    onClick={() => navigate('/manager/financial/invoices')}
                                >
                                    عرض التفاصيل
                                </MuiButton>
                            </MuiBox>
                        )}
                    </MuiPaper>
                </MuiGrid>
            </MuiGrid>

            {/* Recent Transactions */}
            <MuiPaper
                elevation={0}
                sx={{
                    p: 3,
                    background: 'rgba(20, 20, 20, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(216, 185, 138, 0.15)',
                    borderRadius: '24px',
                    mb: 4,
                    overflow: 'hidden'
                }}
            >
                <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <MuiTypography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-primary-500)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Activity size={24} />
                        المعاملات الأخيرة
                    </MuiTypography>
                    <MuiButton
                        variant="text"
                        sx={{ color: 'var(--color-primary-500)' }}
                        onClick={() => navigate('/manager/financial/transactions')}
                    >
                        عرض الكل
                    </MuiButton>
                </MuiBox>

                {recentTransactions.length === 0 ? (
                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', textAlign: 'center', py: 4 }}>
                        لا توجد معاملات حديثة
                    </MuiTypography>
                ) : (
                    <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {recentTransactions.slice(0, 5).map((transaction) => (
                            <MuiBox
                                key={transaction._id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    p: 2,
                                    borderRadius: '16px',
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid transparent',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        background: 'rgba(216, 185, 138, 0.05)',
                                        borderColor: 'rgba(216, 185, 138, 0.1)',
                                        transform: 'translateX(-4px)'
                                    }
                                }}
                            >
                                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <MuiBox sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: transaction.type === 'payment' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    }}>
                                        {transaction.type === 'payment' ?
                                            <ArrowUpRight size={20} color="#22c55e" /> :
                                            <ArrowDownRight size={20} color="#ef4444" />
                                        }
                                    </MuiBox>
                                    <MuiBox sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <MuiTypography variant="body2" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                                            {transaction.displayName || transaction.description || transaction.category}
                                        </MuiTypography>
                                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                            {formatDate(transaction.processedAt || transaction.createdAt)}
                                        </MuiTypography>
                                    </MuiBox>
                                </MuiBox>
                                <MuiTypography
                                    variant="body1"
                                    sx={{
                                        fontWeight: 700,
                                        color: transaction.type === 'payment' ? '#22c55e' : '#ef4444',
                                        fontFamily: 'monospace',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    {transaction.type === 'payment' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                </MuiTypography>
                            </MuiBox>
                        ))}
                    </MuiBox>
                )}
            </MuiPaper>

            {/* Monthly Trend */}
            {monthlyTrend.length > 0 && (
                <MuiPaper
                    elevation={0}
                    sx={{
                        p: 3,
                        background: 'rgba(20, 20, 20, 0.6)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(216, 185, 138, 0.15)',
                        borderRadius: '24px',
                        overflow: 'hidden'
                    }}
                >
                    <MuiTypography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-primary-500)', mb: 3 }}>
                        الاتجاه الشهري
                    </MuiTypography>
                    <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {monthlyTrend.map((month, index) => (
                            <MuiBox key={index} sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                p: 1.5,
                                borderRadius: '12px',
                                background: 'rgba(255, 255, 255, 0.02)'
                            }}>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary)', minWidth: 100, fontWeight: 600 }}>
                                    {month.month}
                                </MuiTypography>
                                <MuiBox sx={{ display: 'flex', gap: 3, flex: 1, justifyContent: 'flex-end' }}>
                                    {/* Stats for small breakdown could go here */}
                                    <MuiBox sx={{ textAlign: 'right' }}>
                                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block' }}>
                                            الإيرادات
                                        </MuiTypography>
                                        <MuiTypography variant="body2" sx={{ fontWeight: 600, color: '#22c55e' }}>
                                            {formatCurrency(month.revenue)}
                                        </MuiTypography>
                                    </MuiBox>
                                    <MuiBox sx={{ textAlign: 'right' }}>
                                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block' }}>
                                            المصروفات
                                        </MuiTypography>
                                        <MuiTypography variant="body2" sx={{ fontWeight: 600, color: '#ef4444' }}>
                                            {formatCurrency(month.expenses)}
                                        </MuiTypography>
                                    </MuiBox>
                                    <MuiBox sx={{ textAlign: 'right' }}>
                                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block' }}>
                                            الربح
                                        </MuiTypography>
                                        <MuiTypography variant="body2" sx={{ fontWeight: 600, color: 'var(--color-primary-500)' }}>
                                            {formatCurrency(month.profit)}
                                        </MuiTypography>
                                    </MuiBox>
                                </MuiBox>
                            </MuiBox>
                        ))}
                    </MuiBox>
                </MuiPaper>
            )}
        </MuiBox>
    )
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, color, bgColor, trend }) {
    return (
        <MuiPaper
            elevation={0}
            sx={{
                p: 3,
                background: 'rgba(20, 20, 20, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(216, 185, 138, 0.1)',
                borderRadius: '24px',
                height: '100%',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                    opacity: 0.5
                },
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 30px -10px ${color}33`,
                    borderColor: `${color}44`
                }
            }}
        >
            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <MuiBox
                    sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '16px',
                        background: bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 12px ${bgColor}`
                    }}
                >
                    <Icon size={28} style={{ color }} />
                </MuiBox>
                {trend !== 'neutral' && (
                    <MuiBox sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        background: trend === 'up' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '8px'
                    }}>
                        {trend === 'up' ? (
                            <ArrowUpRight size={16} style={{ color: '#22c55e' }} />
                        ) : (
                            <ArrowDownRight size={16} style={{ color: '#ef4444' }} />
                        )}
                        <MuiTypography variant="caption" sx={{
                            color: trend === 'up' ? '#22c55e' : '#ef4444',
                            fontWeight: 700
                        }}>
                            {trend === 'up' ? '+2.5%' : '-1.2%'}
                        </MuiTypography>
                    </MuiBox>
                )}
            </MuiBox>
            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 1, fontWeight: 500 }}>
                {title}
            </MuiTypography>
            <MuiTypography variant="h4" sx={{
                fontWeight: 800,
                color: 'var(--color-text-primary)'
            }}>
                {value}
            </MuiTypography>
        </MuiPaper>
    )
}

// Info Row Component
function InfoRow({ label, value, color }) {
    return (
        <MuiBox sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1.5,
            borderRadius: '12px',
            '&:hover': {
                background: 'rgba(255, 255, 255, 0.02)'
            }
        }}>
            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                {label}
            </MuiTypography>
            <MuiTypography variant="body1" sx={{ fontWeight: 700, color: color || 'var(--color-text-primary)' }}>
                {value}
            </MuiTypography>
        </MuiBox>
    )
}
