// src\pages\manager\ManagerFinancialReports.jsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getFinancialReports, getFinancialSummary } from '@/api/manager'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiButton from '@/components/ui/MuiButton'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiFormControl from '@/components/ui/MuiFormControl'
import { SEOHead, LoadingScreen } from '@/components/common'
import { FileText, Download, Calendar, Filter } from 'lucide-react'
import { formatDate } from '@/utils/helpers'

export default function ManagerFinancialReports() {
    const [reportType, setReportType] = useState('monthly_summary')
    const [dateRange, setDateRange] = useState({ start: '', end: '' })
    const [generatedReports, setGeneratedReports] = useState([])

    const { isLoading, refetch } = useQuery({
        queryKey: ['financial-reports', reportType, dateRange],
        queryFn: () => {
            if (reportType === 'general_summary') return getFinancialSummary(dateRange)
            return getFinancialReports({ type: reportType, ...dateRange })
        },
        enabled: false,
    })

    const handleGenerateReport = async () => {
        const result = await refetch()
        if (result.data) {
            const newReport = {
                _id: Date.now().toString(),
                type: reportType,
                generatedAt: new Date().toISOString(),
                dateRange: { ...dateRange },
                status: 'completed',
                data: result.data
            }
            setGeneratedReports([newReport, ...generatedReports])
        }
    }

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
            <SEOHead title="التقارير المالية | INVOCCA" />

            <MuiBox sx={{ mb: 4, textAlign: 'center' }}>
                <MuiTypography variant="h3" sx={{ fontWeight: 800, color: 'var(--color-icon)', mb: 1 }}>التقارير المالية</MuiTypography>
                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>إنشاء وتصدير التقارير المالية المفصلة</MuiTypography>
            </MuiBox>

            <MuiGrid container spacing={4}>
                <MuiGrid item xs={12} md={4}>
                    <MuiPaper sx={{ p: 3, borderRadius: '24px', background: 'var(--color-paper)', border: '1px solid var(--color-border)', position: 'sticky', top: 24 }}>
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Filter size={24} style={{ color: 'var(--color-icon)' }} />
                            <MuiTypography variant="h6" sx={{ fontWeight: 700 }}>إعدادات التقرير</MuiTypography>
                        </MuiBox>

                        <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <MuiFormControl fullWidth>
                                <MuiTypography variant="caption" sx={{ mb: 1, color: 'var(--color-text-secondary)' }}>نوع التقرير</MuiTypography>
                                <MuiSelect value={reportType} onChange={(e) => setReportType(e.target.value)}>
                                    <MuiMenuItem value="general_summary">ملخص عام</MuiMenuItem>
                                    <MuiMenuItem value="monthly_summary">ملخص شهري</MuiMenuItem>
                                    <MuiMenuItem value="expense_breakdown">تفصيل المصاريف</MuiMenuItem>
                                    <MuiMenuItem value="revenue_analysis">تحليل الإيرادات</MuiMenuItem>
                                </MuiSelect>
                            </MuiFormControl>

                            <MuiBox>
                                <MuiTypography variant="caption" sx={{ mb: 1, color: 'var(--color-text-secondary)', display: 'block' }}>الفترة الزمنية</MuiTypography>
                                <MuiBox sx={{ display: 'flex', gap: 2 }}>
                                    <MuiTextField type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} fullWidth />
                                    <MuiTextField type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} fullWidth />
                                </MuiBox>
                            </MuiBox>

                            <MuiButton variant="contained" fullWidth onClick={handleGenerateReport} disabled={isLoading} sx={{ py: 1.5, background: 'var(--color-icon)', color: 'var(--color-dark)', fontWeight: 700 }}>
                                {isLoading ? 'جاري الإنشاء...' : 'إنشاء التقرير'}
                            </MuiButton>
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>

                <MuiGrid item xs={12} md={8}>
                    <MuiTypography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <FileText size={24} color="var(--color-icon)" /> التقارير المنشأة
                    </MuiTypography>

                    {generatedReports.length === 0 ? (
                        <MuiPaper sx={{ p: 6, textAlign: 'center', background: 'var(--color-paper)', border: '1px dashed var(--color-border)', borderRadius: '24px' }}>
                            <Calendar size={48} style={{ color: 'var(--color-text-disabled)', marginBottom: 16 }} />
                            <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>قم بتحديد النوع والفترة ثم اضغط على "إنشاء التقرير"</MuiTypography>
                        </MuiPaper>
                    ) : (
                        <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {generatedReports.map((report) => (
                                <ReportCard key={report._id} report={report} />
                            ))}
                        </MuiBox>
                    )}
                </MuiGrid>
            </MuiGrid>
        </MuiBox>
    )
}

function ReportCard({ report }) {
    const getLabel = (type) => {
        switch (type) {
            case 'general_summary': return 'ملخص مالي عام';
            case 'monthly_summary': return 'ملخص مالي شهري';
            case 'expense_breakdown': return 'تفصيل المصاريف';
            case 'revenue_analysis': return 'تحليل الإيرادات';
            default: return 'تقرير مالي';
        }
    }

    return (
        <MuiPaper sx={{ p: 2.5, borderRadius: '20px', background: 'var(--color-paper)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MuiBox sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: 'rgba(216, 185, 138, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-icon)' }}>
                    <FileText size={24} />
                </MuiBox>
                <MuiBox>
                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 700 }}>{getLabel(report.type)}</MuiTypography>
                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                        {report.dateRange?.start && report.dateRange?.end ? `${report.dateRange.start} - ${report.dateRange.end}` : formatDate(report.generatedAt)}
                    </MuiTypography>
                </MuiBox>
            </MuiBox>
            <MuiBox sx={{ display: 'flex', gap: 1 }}>
                <MuiButton variant="outlined" size="small" startIcon={<Download size={16} />} sx={{ borderRadius: '8px' }}>PDF</MuiButton>
                <MuiButton variant="outlined" size="small" startIcon={<Download size={16} />} sx={{ borderRadius: '8px' }}>Excel</MuiButton>
            </MuiBox>
        </MuiPaper>
    )
}
