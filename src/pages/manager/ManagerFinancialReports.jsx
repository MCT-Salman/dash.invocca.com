// src/pages/manager/ManagerFinancialReports.jsx
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getFinancialReports } from '@/api/manager'
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
import { FileText, Download, Calendar, Filter, PieChart, BarChart } from 'lucide-react'
import { formatDate } from '@/utils/helpers'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function ManagerFinancialReports() {
    const [reportType, setReportType] = useState('monthly_summary')
    const [dateRange, setDateRange] = useState({ start: '', end: '' })
    const [generatedReports, setGeneratedReports] = useState([])

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['financial-reports', reportType, dateRange],
        queryFn: () => getFinancialReports({ type: reportType, ...dateRange }),
        enabled: false, // Only fetch when button is clicked
    })

    const handleGenerateReport = async () => {
        const result = await refetch()
        if (result.data) {
            // Mocking adding a new report to the list
            const newReport = {
                _id: Date.now().toString(),
                type: reportType,
                generatedAt: new Date().toISOString(),
                dateRange: { ...dateRange },
                status: 'completed',
                url: '#', // Placeholder for actual download URL
                data: result.data
            }
            setGeneratedReports([newReport, ...generatedReports])
        }
    }



    const handleExportExcel = (report) => {
        // Create workbook
        const wb = XLSX.utils.book_new()

        // Prepare metadata
        const metadata = [
            ['تقرير مالي', report.type],
            ['تاريخ التقرير', formatDate(report.generatedAt)],
            ['الفترة', `${report.dateRange?.start || ''} - ${report.dateRange?.end || ''}`],
            []
        ]

        let wsData = [...metadata]

        // Process data if available
        if (report.data && Array.isArray(report.data)) {
            // Get headers from first item keys if available
            const firstItem = report.data[0]
            if (firstItem) {
                const headers = Object.keys(firstItem)
                wsData.push(headers)

                // Add rows
                report.data.forEach(item => {
                    const row = headers.map(header => item[header])
                    wsData.push(row)
                })
            }
        } else if (typeof report.data === 'object' && report.data !== null) {
            // If object (e.g. summary), convert to rows
            wsData.push(['المعرف', 'القيمة'])
            Object.entries(report.data).forEach(([key, value]) => {
                wsData.push([key, JSON.stringify(value)])
            })
        } else {
            wsData.push(['لا توجد بيانات'])
        }

        const ws = XLSX.utils.aoa_to_sheet(wsData)
        XLSX.utils.book_append_sheet(wb, ws, "Financial Report")

        // Save file
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' })
        saveAs(dataBlob, `financial_report_${report._id}.xlsx`)
    }

    const handleExportPDF = (report) => {
        const doc = new jsPDF()

        doc.setFontSize(18)
        doc.text('Financial Report', 14, 22)

        doc.setFontSize(11)
        doc.text(`Type: ${report.type}`, 14, 32)
        doc.text(`Date: ${formatDate(report.generatedAt)}`, 14, 40)

        let body = []
        let head = []

        if (report.data && Array.isArray(report.data)) {
            const firstItem = report.data[0]
            if (firstItem) {
                head = [Object.keys(firstItem)]
                body = report.data.map(item => Object.values(item).map(val => String(val)))
            }
        } else if (typeof report.data === 'object' && report.data !== null) {
            head = [['Key', 'Value']]
            body = Object.entries(report.data).map(([key, value]) => [key, String(value)])
        }

        if (body.length > 0) {
            autoTable(doc, {
                startY: 50,
                head: head,
                body: body,
            })
        } else {
            doc.text('No available data to display', 14, 50)
        }

        doc.save(`financial_report_${report._id}.pdf`)
    }

    return (
        <MuiBox sx={{
            p: { xs: 2, sm: 3 },
            minHeight: '100vh',
            background: 'radial-gradient(circle at 50% 0%, rgba(216, 185, 138, 0.05) 0%, rgba(0, 0, 0, 0) 70%)'
        }} >
            <SEOHead title="التقارير المالية | INVOCCA" />

            {/* Header */}
            < MuiBox sx={{ mb: 4, textAlign: 'center' }}>
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
                    التقارير المالية
                </MuiTypography>
                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
                    إنشاء وتحليل التقارير المالية المفصلة للفترات المختلفة
                </MuiTypography>
            </MuiBox >

            <MuiGrid container spacing={4}>
                {/* Report Generator */}
                <MuiGrid item xs={12} md={4}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            p: 3,
                            background: 'rgba(20, 20, 20, 0.6)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(216, 185, 138, 0.2)',
                            borderRadius: '24px',
                            position: 'sticky',
                            top: 24
                        }}
                    >
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <MuiBox sx={{
                                width: 48, height: 48,
                                borderRadius: '14px',
                                background: 'rgba(216, 185, 138, 0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--color-primary-500)'
                            }}>
                                <Filter size={24} />
                            </MuiBox>
                            <MuiTypography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                                إعدادات التقرير
                            </MuiTypography>
                        </MuiBox>

                        <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <MuiFormControl fullWidth>
                                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', mb: 1, ml: 1 }}>
                                    نوع التقرير
                                </MuiTypography>
                                <MuiSelect
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                    sx={{
                                        borderRadius: '12px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        '&:hover': { borderColor: 'var(--color-primary-500)' },
                                        '&.Mui-focused': { borderColor: 'var(--color-primary-500)' },
                                        '& .MuiSelect-select': { color: 'var(--color-text-primary)', py: 1.5 }
                                    }}
                                >
                                    <MuiMenuItem value="monthly_summary">ملخص شهري</MuiMenuItem>
                                    <MuiMenuItem value="expense_breakdown">تفصيل المصروفات</MuiMenuItem>
                                    <MuiMenuItem value="revenue_analysis">تحليل الإيرادات</MuiMenuItem>
                                    <MuiMenuItem value="tax_report">تقرير ضريبي</MuiMenuItem>
                                </MuiSelect>
                            </MuiFormControl>

                            <MuiBox>
                                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', mb: 1, ml: 1, display: 'block' }}>
                                    الفترة الزمنية
                                </MuiTypography>
                                <MuiBox sx={{ display: 'flex', gap: 2 }}>
                                    <MuiTextField
                                        type="date"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                        fullWidth
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                '&:hover': { borderColor: 'var(--color-primary-500)' },
                                                '&.Mui-focused': { borderColor: 'var(--color-primary-500)' }
                                            },
                                            '& input': { color: 'var(--color-text-primary)' },
                                            '& input::-webkit-calendar-picker-indicator': { filter: 'invert(1) opacity(0.5)' }
                                        }}
                                    />
                                    <MuiTypography sx={{ alignSelf: 'center', color: 'var(--color-text-secondary)' }}>-</MuiTypography>
                                    <MuiTextField
                                        type="date"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                        fullWidth
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                '&:hover': { borderColor: 'var(--color-primary-500)' },
                                                '&.Mui-focused': { borderColor: 'var(--color-primary-500)' }
                                            },
                                            '& input': { color: 'var(--color-text-primary)' },
                                            '& input::-webkit-calendar-picker-indicator': { filter: 'invert(1) opacity(0.5)' }
                                        }}
                                    />
                                </MuiBox>
                            </MuiBox>

                            <MuiButton
                                variant="contained"
                                onClick={handleGenerateReport}
                                disabled={isLoading}
                                sx={{
                                    mt: 2,
                                    borderRadius: '12px',
                                    py: 1.5,
                                    background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-700) 100%)',
                                    color: '#000',
                                    fontWeight: 700,
                                    boxShadow: '0 4px 15px rgba(216, 185, 138, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-800) 100%)',
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.2s'
                                }}
                            >
                                {isLoading ? 'جاري الإنشاء...' : 'إنشاء التقرير'}
                            </MuiButton>
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>

                {/* Reports List */}
                <MuiGrid item xs={12} md={8}>
                    <MuiTypography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-text-primary)', mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <FileText size={24} color="var(--color-primary-500)" />
                        التقارير التي تم إنشاؤها
                    </MuiTypography>

                    {generatedReports.length === 0 ? (
                        <MuiPaper
                            elevation={0}
                            sx={{
                                p: 6,
                                textAlign: 'center',
                                background: 'rgba(20, 20, 20, 0.4)',
                                border: '1px dashed rgba(255, 255, 255, 0.1)',
                                borderRadius: '24px'
                            }}
                        >
                            <Calendar size={48} style={{ color: 'var(--color-text-disabled)', marginBottom: 16 }} />
                            <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
                                قم باختيار نوع التقرير والفترة الزمنية ثم اضغط على "إنشاء التقرير"
                            </MuiTypography>
                        </MuiPaper>
                    ) : (
                        <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {generatedReports.map((report) => (
                                <ReportCard
                                    key={report._id}
                                    report={report}
                                    onExportExcel={() => handleExportExcel(report)}
                                    onExportPDF={() => handleExportPDF(report)}
                                />
                            ))}
                        </MuiBox>
                    )}
                </MuiGrid>
            </MuiGrid>
        </MuiBox >
    )
}

function ReportCard({ report, onExportExcel, onExportPDF }) {
    const getIcon = (type) => {
        switch (type) {
            case 'monthly_summary': return <PieChart size={24} />;
            case 'revenue_analysis': return <BarChart size={24} />;
            default: return <FileText size={24} />;
        }
    }

    const getLabel = (type) => {
        switch (type) {
            case 'monthly_summary': return 'ملخص مالي شهري';
            case 'expense_breakdown': return 'تفصيل المصروفات';
            case 'revenue_analysis': return 'تحليل الإيرادات';
            case 'tax_report': return 'تقرير ضريبي';
            default: return 'تقرير مالي';
        }
    }

    return (
        <MuiPaper
            elevation={0}
            sx={{
                p: 2.5,
                background: 'rgba(20, 20, 20, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(216, 185, 138, 0.1)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                '&:hover': {
                    borderColor: 'var(--color-primary-500)',
                    transform: 'translateX(-4px)',
                    background: 'rgba(216, 185, 138, 0.05)'
                }
            }}
        >
            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <MuiBox sx={{
                    width: 56, height: 56,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(216, 185, 138, 0.1) 0%, rgba(216, 185, 138, 0.05) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-primary-500)',
                    border: '1px solid rgba(216, 185, 138, 0.2)'
                }}>
                    {getIcon(report.type)}
                </MuiBox>
                <MuiBox>
                    <MuiTypography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {getLabel(report.type)}
                    </MuiTypography>
                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mt: 0.5 }}>
                        {report.dateRange?.start && report.dateRange?.end ?
                            `${formatDate(report.dateRange.start)} - ${formatDate(report.dateRange.end)}` :
                            formatDate(report.generatedAt)
                        }
                    </MuiTypography>
                </MuiBox>
            </MuiBox>

            <MuiBox sx={{ display: 'flex', gap: 1 }}>
                <MuiButton
                    variant="outlined"
                    startIcon={<Download size={18} />}
                    onClick={onExportPDF}
                    sx={{
                        borderRadius: '10px',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'var(--color-text-secondary)',
                        '&:hover': {
                            borderColor: 'var(--color-primary-500)',
                            color: 'var(--color-primary-500)',
                            background: 'rgba(216, 185, 138, 0.05)'
                        }
                    }}
                >
                    PDF
                </MuiButton>
                <MuiButton
                    variant="outlined"
                    startIcon={<FileText size={18} />}
                    onClick={onExportExcel}
                    sx={{
                        borderRadius: '10px',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'var(--color-text-secondary)',
                        '&:hover': {
                            borderColor: '#10b981',
                            color: '#10b981',
                            background: 'rgba(16, 185, 129, 0.05)'
                        }
                    }}
                >
                    Excel
                </MuiButton>
            </MuiBox>
        </MuiPaper>
    )
}
