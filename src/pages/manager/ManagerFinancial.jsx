// src/pages/manager/ManagerFinancial.jsx
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiButton from '@/components/ui/MuiButton'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiTable from '@/components/ui/MuiTable'
import MuiTableBody from '@/components/ui/MuiTableBody'
import MuiTableCell from '@/components/ui/MuiTableCell'
import MuiTableContainer from '@/components/ui/MuiTableContainer'
import MuiTableHead from '@/components/ui/MuiTableHead'
import MuiTableRow from '@/components/ui/MuiTableRow'
import MuiChip from '@/components/ui/MuiChip'
import MuiIconButton from '@/components/ui/MuiIconButton'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiFormControl from '@/components/ui/MuiFormControl'
import { SEOHead, LoadingScreen } from '@/components/common'
import { useQuery } from '@tanstack/react-query'
import { getManagerInvoices, createManagerInvoice, updateManagerInvoice, recordInvoicePayment, getManagerEvents } from '@/api/manager'
import { useState, useEffect } from 'react'
import { Edit2, DollarSign, CreditCard, Search, Plus } from 'lucide-react'
import { useCRUD } from '@/hooks'
import { formatDate } from '@/utils/helpers'

const premiumMenuProps = {
    PaperProps: {
        sx: {
            bgcolor: 'var(--color-paper)',
            border: '1px solid var(--color-border-glass)',
            borderRadius: '12px',
            mt: 1,
            '& .MuiMenuItem-root': {
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family-base)',
                py: 1.5,
                px: 3,
                '&:hover': {
                    bgcolor: 'var(--color-surface-hover)',
                    color: 'var(--color-primary-400)',
                },
                '&.Mui-selected': {
                    bgcolor: 'var(--color-primary-50)',
                    color: 'var(--color-primary-500)',
                    fontWeight: 600,
                    '&:hover': {
                        bgcolor: 'var(--color-primary-100)',
                    },
                },
            },
        },
    },
}

export default function ManagerFinancial() {
    const [searchTerm, setSearchTerm] = useState('')
    const [page, setPage] = useState(1)
    const [statusFilter, setStatusFilter] = useState('all')
    const [editingInvoice, setEditingInvoice] = useState(null)
    const [paymentDialog, setPaymentDialog] = useState(null)

    // CRUD operations for invoice update
    const {
        handleCreate,
        handleUpdate,
        isLoading: crudLoading,
    } = useCRUD({
        createFn: createManagerInvoice,
        updateFn: updateManagerInvoice,
        deleteFn: null,
        queryKey: ['manager-invoices'], // Broaden key for full invalidation
        successMessage: 'تم حفظ الفاتورة بنجاح',
        errorMessage: 'حدث خطأ أثناء حفظ الفاتورة',
    })

    // Payment mutation - separate because it's a different operation
    const paymentMutationWrapper = async (data) => {
        const { id, ...paymentData } = data
        return recordInvoicePayment(id, paymentData)
    }

    const {
        handleCreate: handlePaymentCreate,
        isLoading: paymentLoading,
    } = useCRUD({
        createFn: paymentMutationWrapper,
        updateFn: null,
        deleteFn: null,
        queryKey: ['manager-invoices'], // Broaden key for full invalidation
        successMessage: 'تم تسجيل الدفعة بنجاح',
        errorMessage: 'حدث خطأ أثناء تسجيل الدفعة',
    })

    const { data: invoicesData, isLoading } = useQuery({
        queryKey: ['manager-invoices', page, statusFilter, searchTerm],
        queryFn: () => getManagerInvoices({ page, status: statusFilter === 'all' ? undefined : statusFilter, search: searchTerm })
    })

    const handleEditInvoice = (invoice) => {
        setEditingInvoice(invoice)
    }

    const handleCloseEdit = () => {
        setEditingInvoice(null)
    }

    const handleSubmitInvoice = async (formData) => {
        const invoiceId = editingInvoice?._id || editingInvoice?.id
        const result = invoiceId
            ? await handleUpdate(invoiceId, formData)
            : await handleCreate(formData)

        if (result.success) {
            setEditingInvoice(null)
        }
    }

    const handleAddPayment = (invoice) => {
        setPaymentDialog({ invoice, amount: '', method: '', reference: '', notes: '' })
    }

    const handleClosePayment = () => {
        setPaymentDialog(null)
    }

    const handleSubmitPayment = async (paymentData) => {
        if (paymentDialog) {
            const result = await handlePaymentCreate({
                id: paymentDialog.invoice._id || paymentDialog.invoice.id,
                ...paymentData
            })
            if (result.success) {
                setPaymentDialog(null)
            }
        }
    }

    if (isLoading) {
        return <LoadingScreen message="جاري تحميل الفواتير..." fullScreen={false} />
    }

    const invoices = invoicesData?.data || invoicesData?.invoices || []
    const pagination = invoicesData?.pagination || {}


    return (
        <MuiBox sx={{
            p: { xs: 2, sm: 3 },
            minHeight: '100vh',
            background: 'radial-gradient(circle at 50% 0%, rgba(216, 185, 138, 0.05) 0%, rgba(0, 0, 0, 0) 70%)'
        }}>
            <SEOHead title="إدارة الفواتير | INVOCCA" />

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
                    إدارة الفواتير
                </MuiTypography>
                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)', maxWidth: 600, mx: 'auto' }}>
                    إدارة الفواتير والمبالغ المستحقة للعملاء ومتابعة حالة الدفع
                </MuiTypography>
            </MuiBox>

            {/* Controls */}
            <MuiPaper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 4,
                    borderRadius: '16px',
                    background: 'var(--color-paper)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--color-border-glass)',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2
                }}
            >
                <MuiButton
                    variant="contained"
                    startIcon={<Plus size={20} />}
                    onClick={() => {
                        setEditingInvoice({})
                    }}
                    sx={{
                        borderRadius: '12px',
                        py: 1.5,
                        px: 3,
                        background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-700) 100%)',
                        color: '#000',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        '&:hover': {
                            background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-800) 100%)',
                        }
                    }}
                >
                    فاتورة جديدة
                </MuiButton>

                <MuiBox sx={{ display: 'flex', gap: 2, flex: 1, width: '100%' }}>
                    <MuiTextField
                        placeholder="البحث عن فاتورة (رقم، اسم العميل)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: 'var(--color-surface)',
                                border: '1px solid var(--color-border-glass)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    borderColor: 'var(--color-primary-400)',
                                    backgroundColor: 'var(--color-surface-hover)',
                                },
                                '&.Mui-focused': {
                                    borderColor: 'var(--color-primary-500)',
                                    boxShadow: '0 0 0 4px var(--color-primary-50)'
                                }
                            }
                        }}
                        InputProps={{
                            startAdornment: <Search size={20} style={{ marginLeft: 8, color: 'var(--color-primary-500)' }} />
                        }}
                    />
                    <MuiFormControl size="medium" sx={{ flex: 1 }}>
                        <MuiSelect
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            displayEmpty
                            fullWidth
                            MenuProps={premiumMenuProps}
                        >
                            <MuiMenuItem value="all">جميع الحالات</MuiMenuItem>
                            <MuiMenuItem value="unpaid">غير مدفوعة</MuiMenuItem>
                            <MuiMenuItem value="partial">مدفوعة جزئياً</MuiMenuItem>
                            <MuiMenuItem value="paid">مدفوعة بالكامل</MuiMenuItem>
                        </MuiSelect>
                    </MuiFormControl>
                </MuiBox>
            </MuiPaper>

            {/* Invoices List (Cards) */}
            <MuiGrid container spacing={3}>
                {invoices.length === 0 ? (
                    <MuiGrid item xs={12}>
                        <MuiPaper sx={{
                            p: 8,
                            textAlign: 'center',
                            background: 'var(--color-paper)',
                            borderRadius: '24px',
                            border: '1px dashed var(--color-border-glass)'
                        }}>
                            <DollarSign size={64} style={{
                                color: 'var(--color-primary-500)',
                                opacity: 0.2,
                                margin: '0 auto 1.5rem'
                            }} />
                            <MuiTypography variant="h6" sx={{ color: 'var(--color-text-secondary)', mb: 1, fontWeight: 700 }}>
                                لا توجد فواتير
                            </MuiTypography>
                            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-disabled)' }}>
                                لم يتم العثور على أي فواتير مطابقة
                            </MuiTypography>
                        </MuiPaper>
                    </MuiGrid>
                ) : (
                    invoices.map((invoice) => (
                        <MuiGrid item xs={12} sm={6} lg={4} key={invoice._id || invoice.id}>
                            <InvoiceCard
                                invoice={invoice}
                                onEdit={() => handleEditInvoice(invoice)}
                                onPay={() => handleAddPayment(invoice)}
                            />
                        </MuiGrid>
                    ))
                )}
            </MuiGrid>

            {/* Pagination Controls could be added here if needed */}

            {/* Dialogs */}
            <InvoiceDialog
                open={!!editingInvoice}
                onClose={handleCloseEdit}
                invoice={editingInvoice}
                onSubmit={handleSubmitInvoice}
                loading={crudLoading}
            />

            <PaymentDialog
                open={!!paymentDialog}
                onClose={handleClosePayment}
                paymentData={paymentDialog}
                onSubmit={handleSubmitPayment}
                loading={paymentLoading}
            />
        </MuiBox>
    )
}

function InvoiceCard({ invoice, onEdit, onPay }) {
    const isPaid = invoice.paymentStatus === 'paid'
    const isOverdue = invoice.isOverdue

    return (
        <MuiPaper
            elevation={0}
            sx={{
                p: 3,
                height: '100%',
                background: 'var(--color-paper)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--color-border-glass)',
                borderRadius: '24px',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 'var(--shadow-lg)',
                    borderColor: 'var(--color-primary-400)'
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '4px',
                    height: '100%',
                    background: isPaid ? '#22c55e' : isOverdue ? '#ef4444' : 'var(--color-primary-500)',
                    opacity: 0.8
                }
            }}
        >
            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <MuiBox>
                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 0.5 }}>
                        رقم الفاتورة
                    </MuiTypography>
                    <MuiTypography variant="h6" sx={{ fontWeight: 800, color: 'var(--color-text-primary)' }}>
                        {invoice.invoiceNumber}
                    </MuiTypography>
                </MuiBox>
                <MuiChip
                    label={
                        invoice.paymentStatus === 'paid' ? 'مدفوعة' :
                            invoice.paymentStatus === 'partial' ? 'مدفوعة جزئياً' :
                                invoice.isOverdue ? 'متأخرة' : 'غير مدفوعة'
                    }
                    size="small"
                    sx={{
                        backgroundColor:
                            isPaid ? 'rgba(34, 197, 94, 0.1)' :
                                invoice.paymentStatus === 'partial' ? 'rgba(216, 185, 138, 0.1)' :
                                    isOverdue ? 'rgba(220, 38, 38, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                        color:
                            isPaid ? '#22c55e' :
                                invoice.paymentStatus === 'partial' ? 'var(--color-primary-500)' :
                                    isOverdue ? '#dc2626' : 'var(--color-text-secondary)',
                        fontWeight: 700,
                        borderRadius: '8px',
                        border: `1px solid ${isPaid ? 'rgba(34, 197, 94, 0.2)' :
                            invoice.paymentStatus === 'partial' ? 'rgba(216, 185, 138, 0.2)' :
                                isOverdue ? 'rgba(220, 38, 38, 0.2)' : 'rgba(107, 114, 128, 0.2)'
                            }`
                    }}
                />
            </MuiBox>

            <MuiBox sx={{ mb: 3, flex: 1 }}>
                <MuiBox sx={{ mb: 3, flex: 1 }}>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-500)', fontWeight: 600, minWidth: 60 }}>
                            العميل:
                        </MuiTypography>
                        <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
                            {invoice.client?.name || invoice.clientInfo?.name || invoice.clientId?.name || 'عميل غير معروف'}
                        </MuiTypography>
                    </MuiBox>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-500)', fontWeight: 600, minWidth: 60 }}>
                            المناسبة:
                        </MuiTypography>
                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                            {invoice.event?.name || invoice.eventInfo?.name || invoice.eventId?.name || 'مناسبة غير محددة'}
                        </MuiTypography>
                    </MuiBox>
                </MuiBox>
            </MuiBox>

            <MuiPaper
                elevation={0}
                sx={{
                    p: 2,
                    background: 'var(--color-surface)',
                    borderRadius: '12px',
                    mb: 2
                }}
            >
                <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>المبلغ الإجمالي</MuiTypography>
                    <MuiTypography variant="body2" sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {invoice.totalAmount?.toLocaleString()} ل.س
                    </MuiTypography>
                </MuiBox>
                <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>المدفوع</MuiTypography>
                    <MuiTypography variant="body2" sx={{ fontWeight: 700, color: '#22c55e' }}>
                        {invoice.paidAmount?.toLocaleString()} ل.س
                    </MuiTypography>
                </MuiBox>
                <MuiBox sx={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', mt: 1 }}>
                    <MuiBox sx={{
                        width: `${Math.min((invoice.paidAmount / invoice.totalAmount) * 100, 100)}%`,
                        height: '100%',
                        background: '#22c55e',
                        borderRadius: '2px'
                    }} />
                </MuiBox>
            </MuiPaper>

            <MuiBox sx={{ display: 'flex', gap: 1 }}>
                <MuiButton
                    fullWidth
                    variant="outlined"
                    onClick={onPay}
                    disabled={isPaid}
                    sx={{
                        borderRadius: '10px',
                        borderColor: isPaid ? 'transparent' : 'rgba(34, 197, 94, 0.3)',
                        color: '#22c55e',
                        background: isPaid ? 'transparent' : 'rgba(34, 197, 94, 0.05)',
                        '&:hover': {
                            borderColor: '#22c55e',
                            background: 'rgba(34, 197, 94, 0.1)',
                        },
                        opacity: isPaid ? 0.5 : 1
                    }}
                >
                    دفع
                </MuiButton>
                <MuiButton
                    fullWidth
                    variant="outlined"
                    onClick={onEdit}
                    sx={{
                        borderRadius: '10px',
                        borderColor: 'rgba(216, 185, 138, 0.3)',
                        color: 'var(--color-primary-500)',
                        background: 'rgba(216, 185, 138, 0.05)',
                        '&:hover': {
                            borderColor: 'var(--color-primary-500)',
                            background: 'rgba(216, 185, 138, 0.1)',
                        }
                    }}
                >
                    تعديل
                </MuiButton>
            </MuiBox>
        </MuiPaper>
    )
}

// Helper to format date for input type="date"
const formatForInput = (dateStr) => {
    if (!dateStr) return ''
    try {
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) return ''
        return date.toISOString().split('T')[0]
    } catch (e) {
        return ''
    }
}

// Invoice Dialog Component
function InvoiceDialog({ open, onClose, invoice, onSubmit, loading }) {
    const isCreateMode = open && invoice && !invoice._id && !invoice.id

    const { data: eventsData } = useQuery({
        queryKey: ['manager-events-minimal'],
        queryFn: () => getManagerEvents({ limit: 100 }),
        enabled: isCreateMode
    })

    const events = eventsData?.data || eventsData?.events || []

    const [formData, setFormData] = useState({
        eventId: (typeof invoice?.eventId === 'string' ? invoice.eventId : (invoice?.eventId?._id || invoice?.eventId?.id)) || '',
        dueDate: formatForInput(invoice?.dueDate),
        type: invoice?.type || 'final',
        notes: invoice?.notes || ''
    })

    useEffect(() => {
        if (open) {
            setFormData({
                eventId: (typeof invoice?.eventId === 'string' ? invoice.eventId : (invoice?.eventId?._id || invoice?.eventId?.id)) || '',
                dueDate: formatForInput(invoice?.dueDate),
                type: invoice?.type || 'final',
                notes: invoice?.notes || ''
            })
        }
    }, [open, invoice])

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const handleChange = (field) => (e) => {
        const val = e?.target ? e.target.value : (e || '');
        setFormData(prev => ({ ...prev, [field]: val }))
    }

    if (!open) return null

    return (
        <MuiBox
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'var(--color-overlay)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1200
            }}
            onClick={onClose}
        >
            <MuiPaper
                elevation={24}
                sx={{
                    p: 4,
                    background: 'var(--color-paper)',
                    border: '1px solid var(--color-primary-500)',
                    borderRadius: '24px',
                    width: '90%',
                    maxWidth: 450,
                    boxShadow: 'var(--shadow-2xl)',
                    position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <MuiTypography variant="h5" sx={{
                    fontWeight: 700,
                    color: 'var(--color-primary-500)',
                    mb: 1,
                    textAlign: 'center'
                }}>
                    {isCreateMode ? 'إنشاء فاتورة جديدة' : 'تعديل الفاتورة'}
                </MuiTypography>
                {!isCreateMode && (
                    <MuiTypography variant="body2" sx={{
                        color: 'var(--color-text-secondary)',
                        mb: 4,
                        textAlign: 'center'
                    }}>
                        {invoice?.invoiceNumber}
                    </MuiTypography>
                )}

                <form onSubmit={handleSubmit}>
                    <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: isCreateMode ? 4 : 0 }}>
                        {isCreateMode && (
                            <MuiFormControl fullWidth>
                                <MuiTextField
                                    select
                                    label="المناسبة"
                                    value={formData.eventId}
                                    onChange={handleChange('eventId')}
                                    required
                                    SelectProps={{ MenuProps: premiumMenuProps }}
                                >
                                    {events.map(event => (
                                        <MuiMenuItem key={event._id || event.id} value={event._id || event.id || ''}>
                                            {event.name} - {formatDate(event.date)}
                                        </MuiMenuItem>
                                    ))}
                                </MuiTextField>
                            </MuiFormControl>
                        )}
                        <MuiTextField
                            label="تاريخ الاستحقاق"
                            type="date"
                            value={formData.dueDate}
                            onChange={handleChange('dueDate')}
                            required
                            fullWidth
                        />

                        <MuiTextField
                            select
                            label="نوع الفاتورة"
                            value={formData.type}
                            onChange={handleChange('type')}
                            SelectProps={{ MenuProps: premiumMenuProps }}
                        >
                            <MuiMenuItem value="preliminary">مبدئية</MuiMenuItem>
                            <MuiMenuItem value="final">نهائية</MuiMenuItem>
                        </MuiTextField>

                        <MuiTextField
                            label="ملاحظات"
                            value={formData.notes}
                            onChange={handleChange('notes')}
                            fullWidth
                            multiline
                            rows={3}
                        />

                        <MuiBox sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <MuiButton
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={loading}
                                sx={{
                                    borderRadius: '12px',
                                    py: 1.5,
                                    background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-700) 100%)',
                                    color: '#000',
                                    fontWeight: 700,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-800) 100%)',
                                        transform: 'translateY(-1px)'
                                    },
                                    transition: 'all 0.2s'
                                }}
                            >
                                {loading ? 'جاري الحفظ...' : (isCreateMode ? 'إنشاء الفاتورة' : 'حفظ التغييرات')}
                            </MuiButton>
                            <MuiButton
                                type="button"
                                variant="outlined"
                                fullWidth
                                onClick={onClose}
                                sx={{
                                    borderRadius: '12px',
                                    py: 1.5,
                                borderColor: 'var(--color-border-glass)',
                                color: 'var(--color-text-secondary)',
                                '&:hover': {
                                    borderColor: 'var(--color-text-primary)',
                                    color: 'var(--color-text-primary)',
                                    background: 'var(--color-surface-hover)'
                                }
                                }}
                            >
                                إلغاء
                            </MuiButton>
                        </MuiBox>
                    </MuiBox>
                </form>
            </MuiPaper>
        </MuiBox>
    )
}

// Payment Dialog Component
function PaymentDialog({ open, onClose, paymentData, onSubmit, loading }) {
    const [formData, setFormData] = useState({
        amount: paymentData?.amount || '',
        paymentMethod: paymentData?.method || '',
        reference: paymentData?.reference || '',
        notes: paymentData?.notes || ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const handleChange = (field) => (e) => {
        const val = e?.target ? e.target.value : (e || '');
        setFormData(prev => ({ ...prev, [field]: val }))
    }

    if (!open) return null

    return (
        <MuiBox
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'var(--color-overlay)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1200
            }}
            onClick={onClose}
        >
            <MuiPaper
                elevation={24}
                sx={{
                    p: 4,
                    background: 'var(--color-paper)',
                    border: '1px solid var(--color-success-500)',
                    borderRadius: '24px',
                    width: '90%',
                    maxWidth: 450,
                    boxShadow: 'var(--shadow-2xl)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <MuiTypography variant="h5" sx={{
                    fontWeight: 700,
                    color: '#22c55e',
                    mb: 1,
                    textAlign: 'center'
                }}>
                    تسجيل دفعة جديدة
                </MuiTypography>
                <MuiTypography variant="body2" sx={{
                    color: 'var(--color-text-secondary)',
                    mb: 4,
                    textAlign: 'center'
                }}>
                    للفاتورة {paymentData?.invoice?.invoiceNumber}
                </MuiTypography>

                <form onSubmit={handleSubmit}>
                    <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <MuiTextField
                            label="المبلغ"
                            type="number"
                            value={formData.amount}
                            onChange={handleChange('amount')}
                            required
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    '&:hover': { borderColor: '#22c55e' },
                                    '&.Mui-focused': { borderColor: '#22c55e' }
                                },
                                '& .MuiInputLabel-root': { color: 'var(--color-text-secondary)' },
                                '& .MuiInputBase-input': { color: 'var(--color-text-primary)' }
                            }}
                        />

                        <MuiFormControl fullWidth>
                            <MuiTextField
                                select
                                label="طريقة الدفع"
                                value={formData.paymentMethod}
                                onChange={handleChange('paymentMethod')}
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        '&:hover': { borderColor: '#22c55e' },
                                        '&.Mui-focused': { borderColor: '#22c55e' }
                                    },
                                    '& .MuiInputLabel-root': { color: 'var(--color-text-secondary)' },
                                    '& .MuiSelect-select': { color: 'var(--color-text-primary)' }
                                }}
                                SelectProps={{ MenuProps: premiumMenuProps }}
                            >
                                <MuiMenuItem value="cash">نقدي</MuiMenuItem>
                                <MuiMenuItem value="bank_transfer">تحويل بنكي</MuiMenuItem>
                                <MuiMenuItem value="credit_card">بطاقة ائتمان</MuiMenuItem>
                                <MuiMenuItem value="check">شيك</MuiMenuItem>
                            </MuiTextField>
                        </MuiFormControl>

                        <MuiTextField
                            label="رقم المرجع"
                            value={formData.reference}
                            onChange={handleChange('reference')}
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    '&:hover': { borderColor: '#22c55e' },
                                    '&.Mui-focused': { borderColor: '#22c55e' }
                                },
                                '& .MuiInputLabel-root': { color: 'var(--color-text-secondary)' },
                                '& .MuiInputBase-input': { color: 'var(--color-text-primary)' }
                            }}
                        />

                        <MuiTextField
                            label="ملاحظات"
                            value={formData.notes}
                            onChange={handleChange('notes')}
                            fullWidth
                            multiline
                            rows={2}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    '&:hover': { borderColor: '#22c55e' },
                                    '&.Mui-focused': { borderColor: '#22c55e' }
                                },
                                '& .MuiInputLabel-root': { color: 'var(--color-text-secondary)' },
                                '& .MuiInputBase-input': { color: 'var(--color-text-primary)' }
                            }}
                        />

                        <MuiBox sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <MuiButton
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={loading}
                                sx={{
                                    borderRadius: '12px',
                                    py: 1.5,
                                    background: 'linear-gradient(135deg, #22c55e 0%, #166534 100%)',
                                    color: '#fff',
                                    fontWeight: 700,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                        transform: 'translateY(-1px)'
                                    },
                                    transition: 'all 0.2s'
                                }}
                            >
                                {loading ? 'جاري التسجيل...' : 'تأكيد الدفعة'}
                            </MuiButton>
                            <MuiButton
                                type="button"
                                variant="outlined"
                                fullWidth
                                onClick={onClose}
                                sx={{
                                    borderRadius: '12px',
                                    py: 1.5,
                                borderColor: 'var(--color-border-glass)',
                                color: 'var(--color-text-secondary)',
                                '&:hover': {
                                    borderColor: 'var(--color-text-primary)',
                                    color: 'var(--color-text-primary)',
                                    background: 'var(--color-surface-hover)'
                                }
                                }}
                            >
                                إلغاء
                            </MuiButton>
                        </MuiBox>
                    </MuiBox>
                </form>
            </MuiPaper>
        </MuiBox>
    )
}
