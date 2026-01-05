// src\pages\manager\ManagerFinancial.jsx
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiButton from '@/components/ui/MuiButton'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiGrid from '@/components/ui/MuiGrid'
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
import { getManagerInvoices, updateManagerInvoice, recordInvoicePayment } from '@/api/manager'
import { useState } from 'react'
import { Plus, Edit2, DollarSign, Calendar, CreditCard, Eye } from 'lucide-react'
import { useCRUD } from '@/hooks'

export default function ManagerFinancial() {
    const [searchTerm, setSearchTerm] = useState('')
    const [page, setPage] = useState(1)
    const [statusFilter, setStatusFilter] = useState('all')
    const [editingInvoice, setEditingInvoice] = useState(null)
    const [paymentDialog, setPaymentDialog] = useState(null)

    // CRUD operations for invoice update
    const {
        updateMutation,
        handleUpdate,
        isLoading: updateLoading,
    } = useCRUD({
        createFn: null,
        updateFn: updateManagerInvoice,
        deleteFn: null,
        queryKey: ['manager-invoices', page, statusFilter],
        successMessage: 'تم تحديث الفاتورة بنجاح',
        errorMessage: 'حدث خطأ أثناء تحديث الفاتورة',
    })

    // Payment mutation - separate because it's a different operation
    // We need to wrap recordInvoicePayment to match useCRUD's expected signature
    const paymentMutationWrapper = async (data) => {
        const { id, ...paymentData } = data
        return recordInvoicePayment(id, paymentData)
    }
    
    const {
        createMutation: paymentMutation,
        handleCreate: handlePaymentCreate,
        isLoading: paymentLoading,
    } = useCRUD({
        createFn: paymentMutationWrapper,
        updateFn: null,
        deleteFn: null,
        queryKey: ['manager-invoices', page, statusFilter],
        successMessage: 'تم تسجيل الدفعة بنجاح',
        errorMessage: 'حدث خطأ أثناء تسجيل الدفعة',
    })

    const { data: invoicesData, isLoading, refetch } = useQuery({
        queryKey: ['manager-invoices', page, statusFilter],
        queryFn: () => getManagerInvoices({ page, status: statusFilter === 'all' ? undefined : statusFilter })
    })

    const handleEditInvoice = (invoice) => {
        setEditingInvoice(invoice)
    }

    const handleCloseEdit = () => {
        setEditingInvoice(null)
    }

    const handleSubmitInvoice = async (formData) => {
        if (editingInvoice) {
            const result = await handleUpdate(editingInvoice.id, formData)
            if (result.success) {
                setEditingInvoice(null)
            }
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
                id: paymentDialog.invoice.id,
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

    const invoices = invoicesData?.invoices || []
    const pagination = invoicesData?.pagination || {}

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh' }}>
            <SEOHead title="إدارة الفواتير | INVOCCA" />

            {/* Header */}
            <MuiBox sx={{ mb: 4, textAlign: 'center' }}>
                <MuiTypography variant="h3" sx={{ 
                    fontWeight: 800, 
                    color: 'var(--color-text-primary-dark)', 
                    mb: 1,
                    background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    إدارة الفواتير
                </MuiTypography>
                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
                    إدارة الفواتير والمبالغ المستحقة للعملاء
                </MuiTypography>
            </MuiBox>

            {/* Controls */}
            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6, flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                <MuiBox sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <MuiTextField
                        placeholder="البحث عن فاتورة..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            minWidth: 250,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            }
                        }}
                    />
                    <MuiFormControl size="small" sx={{ minWidth: 120 }}>
                        <MuiSelect
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            sx={{
                                borderRadius: '10px',
                                background: 'var(--color-surface-dark)',
                                border: '1px solid var(--color-border-glass)',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                }
                            }}
                        >
                            <MuiMenuItem value="all">الكل</MuiMenuItem>
                            <MuiMenuItem value="unpaid">غير مدفوعة</MuiMenuItem>
                            <MuiMenuItem value="partial">مدفوعة جزئياً</MuiMenuItem>
                            <MuiMenuItem value="paid">مدفوعة بالكامل</MuiMenuItem>
                        </MuiSelect>
                    </MuiFormControl>
                </MuiBox>
            </MuiBox>

            {/* Invoices Table */}
            <MuiPaper
                elevation={0}
                sx={{
                    background: 'var(--color-surface-dark)',
                    border: '1px solid var(--color-border-glass)',
                    borderRadius: '24px',
                    overflow: 'hidden'
                }}
            >
                <MuiTableContainer>
                    <MuiTable>
                        <MuiTableHead>
                            <MuiTableRow>
                                <MuiTableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary-dark)' }}>رقم الفاتورة</MuiTableCell>
                                <MuiTableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary-dark)' }}>العميل</MuiTableCell>
                                <MuiTableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary-dark)' }}>المناسبة</MuiTableCell>
                                <MuiTableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary-dark)' }}>المبلغ الإجمالي</MuiTableCell>
                                <MuiTableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary-dark)' }}>المدفوع</MuiTableCell>
                                <MuiTableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary-dark)' }}>المتبقي</MuiTableCell>
                                <MuiTableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary-dark)' }}>الحالة</MuiTableCell>
                                <MuiTableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary-dark)' }}>الإجراءات</MuiTableCell>
                            </MuiTableRow>
                        </MuiTableHead>
                        <MuiTableBody>
                            {invoices.length === 0 ? (
                                <MuiTableRow>
                                    <MuiTableCell colSpan={8} sx={{ textAlign: 'center', py: 8 }}>
                                        <MuiBox sx={{ textAlign: 'center' }}>
                                            <DollarSign size={64} style={{ 
                                                color: 'var(--color-text-disabled)', 
                                                opacity: 0.5,
                                                margin: '0 auto 1.5rem'
                                            }} />
                                            <MuiTypography variant="h6" sx={{ 
                                                color: 'var(--color-text-secondary)', 
                                                mb: 2, 
                                                fontWeight: 700 
                                            }}>
                                                لا توجد فواتير
                                            </MuiTypography>
                                            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-disabled)' }}>
                                                لم يتم إنشاء أي فواتير بعد
                                            </MuiTypography>
                                        </MuiBox>
                                    </MuiTableCell>
                                </MuiTableRow>
                            ) : (
                                invoices.map((invoice) => (
                                    <MuiTableRow key={invoice.id} sx={{ '&:hover': { backgroundColor: 'rgba(216, 185, 138, 0.05)' } }}>
                                        <MuiTableCell sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                                            {invoice.invoiceNumber}
                                        </MuiTableCell>
                                        <MuiTableCell sx={{ color: 'var(--color-text-secondary)' }}>
                                            {invoice.clientInfo?.name || '-'}
                                        </MuiTableCell>
                                        <MuiTableCell sx={{ color: 'var(--color-text-secondary)' }}>
                                            {invoice.eventInfo?.name || '-'}
                                        </MuiTableCell>
                                        <MuiTableCell sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                                            {invoice.totalAmount?.toLocaleString()} ل.س
                                        </MuiTableCell>
                                        <MuiTableCell sx={{ color: 'var(--color-text-secondary)' }}>
                                            {invoice.paidAmount?.toLocaleString()} ل.س
                                        </MuiTableCell>
                                        <MuiTableCell sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                                            {invoice.remainingAmount?.toLocaleString()} ل.س
                                        </MuiTableCell>
                                        <MuiTableCell>
                                            <MuiChip
                                                label={
                                                    invoice.paymentStatus === 'paid' ? 'مدفوعة' :
                                                    invoice.paymentStatus === 'partial' ? 'مدفوعة جزئياً' :
                                                    invoice.isOverdue ? 'متأخرة' : 'غير مدفوعة'
                                                }
                                                size="small"
                                                sx={{
                                                    backgroundColor: 
                                                        invoice.paymentStatus === 'paid' ? 'rgba(34, 197, 94, 0.1)' :
                                                        invoice.paymentStatus === 'partial' ? 'rgba(216, 185, 138, 0.1)' :
                                                        invoice.isOverdue ? 'rgba(220, 38, 38, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                                                    color: 
                                                        invoice.paymentStatus === 'paid' ? '#22c55e' :
                                                        invoice.paymentStatus === 'partial' ? 'var(--color-primary-500)' :
                                                        invoice.isOverdue ? '#dc2626' : 'var(--color-text-secondary)',
                                                    fontWeight: 600,
                                                    fontSize: '0.75rem',
                                                    height: 28,
                                                    borderRadius: '8px'
                                                }}
                                            />
                                        </MuiTableCell>
                                        <MuiTableCell>
                                            <MuiBox sx={{ display: 'flex', gap: 1 }}>
                                                <MuiIconButton
                                                    size="small"
                                                    onClick={() => handleAddPayment(invoice)}
                                                    disabled={invoice.paymentStatus === 'paid'}
                                                    sx={{
                                                        background: invoice.paymentStatus === 'paid' ? 'rgba(107, 114, 128, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                                        '&:hover': {
                                                            background: invoice.paymentStatus === 'paid' ? 'rgba(107, 114, 128, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                                            color: invoice.paymentStatus === 'paid' ? 'var(--color-text-secondary)' : '#22c55e'
                                                        }
                                                    }}
                                                >
                                                    <CreditCard size={16} />
                                                </MuiIconButton>
                                                <MuiIconButton
                                                    size="small"
                                                    onClick={() => handleEditInvoice(invoice)}
                                                    sx={{
                                                        background: 'rgba(216, 185, 138, 0.1)',
                                                        '&:hover': {
                                                            background: 'rgba(216, 185, 138, 0.2)',
                                                            color: 'var(--color-primary-500)'
                                                        }
                                                    }}
                                                >
                                                    <Edit2 size={16} />
                                                </MuiIconButton>
                                            </MuiBox>
                                        </MuiTableCell>
                                    </MuiTableRow>
                                ))
                            )}
                        </MuiTableBody>
                    </MuiTable>
                </MuiTableContainer>
            </MuiPaper>

            {/* Pagination */}
            {pagination.pages > 1 && (
                <MuiBox sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
                    <MuiButton
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        sx={{
                            borderRadius: '8px',
                            borderColor: 'var(--color-border-glass)',
                            color: 'var(--color-text-primary-dark)'
                        }}
                        variant="outlined"
                    >
                        السابق
                    </MuiButton>
                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }}>
                        صفحة {page} من {pagination.pages}
                    </MuiTypography>
                    <MuiButton
                        disabled={page === pagination.pages}
                        onClick={() => setPage(page + 1)}
                        sx={{
                            borderRadius: '8px',
                            borderColor: 'var(--color-border-glass)',
                            color: 'var(--color-text-primary-dark)'
                        }}
                        variant="outlined"
                    >
                        التالي
                    </MuiButton>
                </MuiBox>
            )}

            {/* Edit Invoice Dialog */}
            <InvoiceDialog
                open={!!editingInvoice}
                onClose={handleCloseEdit}
                invoice={editingInvoice}
                onSubmit={handleSubmitInvoice}
                loading={updateLoading}
            />

            {/* Payment Dialog */}
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

// Invoice Dialog Component
function InvoiceDialog({ open, onClose, invoice, onSubmit, loading }) {
    const [formData, setFormData] = useState({
        dueDate: invoice?.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : '',
        type: invoice?.type || 'final',
        notes: invoice?.notes || ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }))
    }

    return (
        <MuiBox
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: open ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999
            }}
            onClick={onClose}
        >
            <MuiPaper
                elevation={0}
                sx={{
                    p: 4,
                    background: 'var(--color-surface-dark)',
                    border: '1px solid var(--color-border-glass)',
                    borderRadius: '24px',
                    width: '90%',
                    maxWidth: 500,
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <MuiTypography variant="h6" sx={{ 
                    fontWeight: 700, 
                    color: 'var(--color-text-primary-dark)', 
                    mb: 4 
                }}>
                    تعديل الفاتورة {invoice?.invoiceNumber}
                </MuiTypography>

                <form onSubmit={handleSubmit}>
                    <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <MuiTextField
                            label="تاريخ الاستحقاق"
                            type="date"
                            value={formData.dueDate}
                            onChange={handleChange('dueDate')}
                            required
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                }
                            }}
                        />

                        <MuiFormControl fullWidth>
                            <MuiTextField
                                select
                                label="نوع الفاتورة"
                                value={formData.type}
                                onChange={handleChange('type')}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    }
                                }}
                            >
                                <MuiMenuItem value="preliminary">مبدئية</MuiMenuItem>
                                <MuiMenuItem value="final">نهائية</MuiMenuItem>
                            </MuiTextField>
                        </MuiFormControl>

                        <MuiTextField
                            label="ملاحظات"
                            value={formData.notes}
                            onChange={handleChange('notes')}
                            fullWidth
                            multiline
                            rows={3}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                }
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
                                    py: 2,
                                    background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                                    color: '#1A1A1A',
                                    boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))',
                                    }
                                }}
                            >
                                {loading ? 'جاري الحفظ...' : 'حفظ'}
                            </MuiButton>
                            <MuiButton
                                type="button"
                                variant="outlined"
                                fullWidth
                                onClick={onClose}
                                sx={{
                                    borderRadius: '12px',
                                    py: 2,
                                    borderColor: 'var(--color-border-glass)',
                                    color: 'var(--color-text-primary-dark)',
                                    '&:hover': {
                                        borderColor: 'var(--color-primary-500)',
                                        backgroundColor: 'rgba(216, 185, 138, 0.1)',
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
        setFormData(prev => ({ ...prev, [field]: e.target.value }))
    }

    return (
        <MuiBox
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: open ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999
            }}
            onClick={onClose}
        >
            <MuiPaper
                elevation={0}
                sx={{
                    p: 4,
                    background: 'var(--color-surface-dark)',
                    border: '1px solid var(--color-border-glass)',
                    borderRadius: '24px',
                    width: '90%',
                    maxWidth: 500,
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <MuiTypography variant="h6" sx={{ 
                    fontWeight: 700, 
                    color: 'var(--color-text-primary-dark)', 
                    mb: 4 
                }}>
                    تسجيل دفعة للفاتورة {paymentData?.invoice?.invoiceNumber}
                </MuiTypography>

                <form onSubmit={handleSubmit}>
                    <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                }
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
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    }
                                }}
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
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                }
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
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                }
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
                                    py: 2,
                                    background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                                    color: '#1A1A1A',
                                    boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))',
                                    }
                                }}
                            >
                                {loading ? 'جاري الحفظ...' : 'تسجيل الدفعة'}
                            </MuiButton>
                            <MuiButton
                                type="button"
                                variant="outlined"
                                fullWidth
                                onClick={onClose}
                                sx={{
                                    borderRadius: '12px',
                                    py: 2,
                                    borderColor: 'var(--color-border-glass)',
                                    color: 'var(--color-text-primary-dark)',
                                    '&:hover': {
                                        borderColor: 'var(--color-primary-500)',
                                        backgroundColor: 'rgba(216, 185, 138, 0.1)',
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
