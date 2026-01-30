// src/pages/manager/ManagerTransactions.jsx
import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getFinancialTransactions, createFinancialTransaction, updateFinancialTransaction, getManagerEvents, getClients } from '@/api/manager'
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
import { useCRUD } from '@/hooks'
import { Plus, Edit2, DollarSign, TrendingUp, TrendingDown, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatCurrency, formatDate } from '@/utils/helpers'

const premiumMenuProps = {
    PaperProps: {
        sx: {
            bgcolor: '#1E1E1E',
            border: '1px solid rgba(216, 185, 138, 0.2)',
            borderRadius: '12px',
            mt: 1,
            '& .MuiMenuItem-root': {
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family-base)',
                py: 1.5,
                px: 3,
                '&:hover': {
                    bgcolor: 'var(--color-border-glass)',
                    color: 'var(--color-primary-400)',
                },
                '&.Mui-selected': {
                    bgcolor: 'rgba(216, 185, 138, 0.15)',
                    color: 'var(--color-primary-500)',
                    fontWeight: 600,
                    '&:hover': {
                        bgcolor: 'rgba(216, 185, 138, 0.2)',
                    },
                },
            },
        },
    },
}

export default function ManagerTransactions() {
    const [page, setPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [typeFilter, setTypeFilter] = useState('all')
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState(null)

    const {
        handleCreate,
        handleUpdate,
        isLoading: crudLoading,
    } = useCRUD({
        createFn: createFinancialTransaction,
        updateFn: updateFinancialTransaction,
        deleteFn: null,
        queryKey: ['financial-transactions', page, typeFilter],
        successMessage: {
            create: 'تم إنشاء المعاملة بنجاح',
            update: 'تم تحديث المعاملة بنجاح',
        },
    })

    const { data, isLoading } = useQuery({
        queryKey: ['financial-transactions', page, typeFilter],
        queryFn: () => getFinancialTransactions({
            page,
            type: typeFilter === 'all' ? undefined : typeFilter
        }),
    })

    const handleOpenCreate = () => {
        setCreateDialogOpen(true)
    }

    const handleCloseCreate = () => {
        setCreateDialogOpen(false)
    }

    const handleOpenEdit = (transaction) => {
        setEditingTransaction(transaction)
    }

    const handleCloseEdit = () => {
        setEditingTransaction(null)
    }

    const handleSubmitCreate = async (formData) => {
        const result = await handleCreate(formData)
        if (result.success) {
            setCreateDialogOpen(false)
        }
    }

    const handleSubmitEdit = async (formData) => {
        if (editingTransaction) {
            const result = await handleUpdate(editingTransaction._id || editingTransaction.id, formData)
            if (result.success) {
                setEditingTransaction(null)
            }
        }
    }

    if (isLoading) {
        return <LoadingScreen message="جاري تحميل المعاملات..." fullScreen={false} />
    }

    const transactions = data?.data || data?.transactions || []
    const pagination = data?.pagination || {}

    // Filter transactions by search term
    const filteredTransactions = transactions.filter((transaction) => {
        if (!searchTerm) return true
        const search = searchTerm.toLowerCase()
        return (
            transaction.transactionId?.toLowerCase().includes(search) ||
            transaction.receiptNumber?.toLowerCase().includes(search) ||
            transaction.displayName?.toLowerCase().includes(search) ||
            transaction.clientId?.name?.toLowerCase().includes(search)
        )
    })

    return (
        <MuiBox sx={{
            p: { xs: 2, sm: 3 },
            minHeight: '100vh',
            background: 'radial-gradient(circle at 50% 0%, rgba(216, 185, 138, 0.05) 0%, rgba(0, 0, 0, 0) 70%)'
        }}>
            <SEOHead title="إدارة المعاملات المالية | INVOCCA" />

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
                    إدارة المعاملات المالية
                </MuiTypography>
                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)', maxWidth: 600, mx: 'auto' }}>
                    تتبع وإدارة جميع العمليات المالية والدفعات والمصروفات
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
                <MuiBox sx={{ display: 'flex', gap: 2, flex: 1, width: '100%' }}>
                    <MuiTextField
                        placeholder="البحث في المعاملات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid var(--color-border-glass)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    borderColor: 'rgba(216, 185, 138, 0.3)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                },
                                '&.Mui-focused': {
                                    borderColor: 'var(--color-primary-500)',
                                    boxShadow: '0 0 0 4px var(--color-border-glass)'
                                }
                            }
                        }}
                        InputProps={{
                            startAdornment: <Search size={20} style={{ marginLeft: 8, color: 'var(--color-primary-500)' }} />
                        }}
                    />
                    <MuiFormControl size="medium" sx={{ flex: 1 }}>
                        <MuiSelect
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            displayEmpty
                            fullWidth
                            MenuProps={premiumMenuProps}
                            sx={{
                                borderRadius: '12px',
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid var(--color-border-glass)',
                                color: 'var(--color-text-primary)',
                                '& .MuiSelect-select': { py: 1.5 },
                                '&:hover': {
                                    borderColor: 'rgba(216, 185, 138, 0.3)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                },
                                '&.Mui-focused': {
                                    borderColor: 'var(--color-primary-500)',
                                }
                            }}
                        >
                            <MuiMenuItem value="all">جميع العمليات</MuiMenuItem>
                            <MuiMenuItem value="payment">دفعات واردة</MuiMenuItem>
                            <MuiMenuItem value="expense">مصروفات</MuiMenuItem>
                            <MuiMenuItem value="refund">استرداد</MuiMenuItem>
                        </MuiSelect>
                    </MuiFormControl>
                </MuiBox>
                <MuiButton
                    variant="contained"
                    startIcon={<Plus size={20} />}
                    onClick={handleOpenCreate}
                    sx={{
                        borderRadius: '12px',
                        px: 3,
                        py: 1.5,
                        background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-700) 100%)',
                        color: '#000',
                        fontWeight: 700,
                        boxShadow: '0 4px 15px rgba(216, 185, 138, 0.3)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-800) 100%)',
                            transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                    }}
                >
                    إضافة معاملة
                </MuiButton>
            </MuiPaper>

            {/* Transactions Grid */}
            <MuiGrid container spacing={3}>
                {filteredTransactions.length === 0 ? (
                    <MuiGrid item xs={12}>
                        <MuiPaper sx={{
                            p: 8,
                            textAlign: 'center',
                            background: 'var(--color-paper)',
                            borderRadius: '24px',
                            border: '1px dashed rgba(216, 185, 138, 0.2)'
                        }}>
                            <DollarSign size={64} style={{ color: 'var(--color-primary-500)', opacity: 0.2, margin: '0 auto 1.5rem' }} />
                            <MuiTypography variant="h6" sx={{ color: 'var(--color-text-secondary)', mt: 1 }}>
                                لا توجد معاملات
                            </MuiTypography>
                            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-disabled)' }}>
                                لم يتم العثور على أي معاملات
                            </MuiTypography>
                        </MuiPaper>
                    </MuiGrid>
                ) : (
                    filteredTransactions.map((transaction) => (
                        <MuiGrid item xs={12} sm={6} lg={4} key={transaction._id}>
                            <TransactionCard
                                transaction={transaction}
                                onEdit={() => handleOpenEdit(transaction)}
                            />
                        </MuiGrid>
                    ))
                )}
            </MuiGrid>

            {/* Create Dialog */}
            <TransactionDialog
                open={createDialogOpen}
                onClose={handleCloseCreate}
                onSubmit={handleSubmitCreate}
                loading={crudLoading}
                title="إضافة معاملة جديدة"
            />

            {/* Edit Dialog */}
            <TransactionDialog
                open={!!editingTransaction}
                onClose={handleCloseEdit}
                onSubmit={handleSubmitEdit}
                loading={crudLoading}
                title="تعديل معاملة"
                transaction={editingTransaction}
            />
        </MuiBox >
    )
}

function TransactionCard({ transaction, onEdit }) {
    const isPayment = transaction.type === 'payment'
    const isCompleted = transaction.status === 'completed'
    const color = isPayment ? '#22c55e' : '#ef4444'

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
                    boxShadow: '0 12px 24px -10px rgba(0, 0, 0, 0.5)',
                    borderColor: 'rgba(216, 185, 138, 0.3)'
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                    opacity: 0.5
                }
            }}
        >
            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <MuiBox sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <MuiBox sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '16px',
                        background: isPayment ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: color
                    }}>
                        {isPayment ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
                    </MuiBox>
                    <MuiBox>
                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                            {transaction.type === 'payment' ? 'دفعة واردة' : 'مصروف'}
                        </MuiTypography>
                        <MuiTypography variant="body1" sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                            {transaction.transactionId || transaction.receiptNumber}
                        </MuiTypography>
                    </MuiBox>
                </MuiBox>
                <MuiChip
                    label={isCompleted ? 'مكتمل' : 'قيد الانتظار'}
                    size="small"
                    sx={{
                        backgroundColor: isCompleted ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                        color: isCompleted ? '#22c55e' : 'var(--color-text-secondary)',
                        fontWeight: 600,
                        borderRadius: '8px',
                        border: `1px solid ${isCompleted ? 'rgba(34, 197, 94, 0.2)' : 'rgba(107, 114, 128, 0.2)'}`
                    }}
                />
            </MuiBox>

            <MuiTypography variant="h4" sx={{
                fontWeight: 700,
                color: color,
                mb: 3,
                fontFamily: 'monospace',
                letterSpacing: '-1px'
            }}>
                {isPayment ? '+' : '-'}{formatCurrency(transaction.amount)}
            </MuiTypography>

            <MuiBox sx={{ mb: 3, flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 1 }}>
                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>التاريخ</MuiTypography>
                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>
                        {formatDate(transaction.processedAt || transaction.createdAt)}
                    </MuiTypography>
                </MuiBox>

                {(transaction.clientId || transaction.client) && (
                    <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 1 }}>
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>العميل</MuiTypography>
                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>
                            {transaction.client?.name || transaction.clientId?.name || 'عميل'}
                        </MuiTypography>
                    </MuiBox>
                )}

                {(transaction.eventId || transaction.event) && (
                    <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 1 }}>
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>المناسبة</MuiTypography>
                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>
                            {transaction.event?.name || transaction.eventId?.name || 'مناسبة'}
                        </MuiTypography>
                    </MuiBox>
                )}

                <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', pb: 1 }}>
                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>طريقة الدفع</MuiTypography>
                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>
                        {transaction.paymentMethod === 'cash' ? 'نقدي' :
                            transaction.paymentMethod === 'bank_transfer' ? 'تحويل بنكي' :
                                transaction.paymentMethod === 'credit_card' ? 'بطاقة ائتمان' :
                                    transaction.paymentMethod === 'check' ? 'شيك' : transaction.paymentMethod}
                    </MuiTypography>
                </MuiBox>
            </MuiBox>

            <MuiButton
                fullWidth
                variant="outlined"
                startIcon={<Edit2 size={18} />}
                onClick={onEdit}
                disabled={isCompleted}
                sx={{
                    borderRadius: '12px',
                    borderColor: 'rgba(216, 185, 138, 0.3)',
                    color: 'var(--color-primary-500)',
                    background: 'rgba(216, 185, 138, 0.05)',
                    '&:hover': {
                        borderColor: 'var(--color-primary-500)',
                        background: 'var(--color-border-glass)',
                    },
                    opacity: isCompleted ? 0.5 : 1
                }}
            >
                تعديل التفاصيل
            </MuiButton>
        </MuiPaper>
    )
}

// Transaction Dialog Component
function TransactionDialog({ open, onClose, onSubmit, loading, title, transaction }) {
    const { data: eventsData } = useQuery({
        queryKey: ['manager-events-minimal'],
        queryFn: () => getManagerEvents({ limit: 100 }),
        enabled: open
    })

    const { data: clientsData } = useQuery({
        queryKey: ['manager-clients-minimal'],
        queryFn: () => getClients({ limit: 100 }),
        enabled: open
    })

    const events = eventsData?.data || eventsData?.events || []
    const clients = clientsData?.data || clientsData?.clients || []

    const [formData, setFormData] = useState({
        eventId: (typeof transaction?.eventId === 'string' ? transaction.eventId : transaction?.eventId?._id) || '',
        clientId: (typeof transaction?.clientId === 'string' ? transaction.clientId : transaction?.clientId?._id) || '',
        type: transaction?.type || 'payment',
        category: transaction?.category || 'event_payment',
        amount: transaction?.amount || '',
        paymentMethod: transaction?.paymentMethod || '',
        reference: transaction?.reference || '',
        description: transaction?.description || '',
        notes: transaction?.notes || '',
    })

    useEffect(() => {
        if (open) {
            setFormData({
                eventId: (typeof transaction?.eventId === 'string' ? transaction.eventId : transaction?.eventId?._id) || '',
                clientId: (typeof transaction?.clientId === 'string' ? transaction.clientId : transaction?.clientId?._id) || '',
                type: transaction?.type || 'payment',
                category: transaction?.category || 'event_payment',
                amount: transaction?.amount || '',
                paymentMethod: transaction?.paymentMethod || '',
                reference: transaction?.reference || '',
                description: transaction?.description || '',
                notes: transaction?.notes || '',
            })
        }
    }, [open, transaction])

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
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
                    maxWidth: 550,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxShadow: '0 0 40px rgba(0,0,0,0.5)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <MuiTypography variant="h5" sx={{
                    fontWeight: 700,
                    color: 'var(--color-primary-500)',
                    mb: 4,
                    textAlign: 'center',
                    borderBottom: '1px solid var(--color-border-glass)',
                    pb: 2
                }}>
                    {title}
                </MuiTypography>

                <form onSubmit={handleSubmit}>
                    <MuiGrid container spacing={2}>
                        <MuiGrid item xs={12} sm={6}>
                            <MuiTextField
                                select
                                label="المناسبة (اختياري)"
                                value={formData.eventId}
                                onChange={handleChange('eventId')}
                                fullWidth
                                SelectProps={{ MenuProps: premiumMenuProps }}
                            >
                                <MuiMenuItem value="">بدون مناسبة</MuiMenuItem>
                                {events.map(event => (
                                    <MuiMenuItem key={event._id || event.id} value={event._id || event.id || ''}>
                                        {event.name}
                                    </MuiMenuItem>
                                ))}
                            </MuiTextField>
                        </MuiGrid>

                        <MuiGrid item xs={12} sm={6}>
                            <MuiTextField
                                select
                                label="العميل (اختياري)"
                                value={formData.clientId}
                                onChange={handleChange('clientId')}
                                fullWidth
                                SelectProps={{ MenuProps: premiumMenuProps }}
                            >
                                <MuiMenuItem value="">بدون عميل</MuiMenuItem>
                                {clients.map(client => (
                                    <MuiMenuItem key={client._id || client.id} value={client._id || client.id || ''}>
                                        {client.name}
                                    </MuiMenuItem>
                                ))}
                            </MuiTextField>
                        </MuiGrid>

                        <MuiGrid item xs={12} sm={6}>
                            <MuiTextField
                                select
                                label="النوع"
                                value={formData.type}
                                onChange={handleChange('type')}
                                required
                                fullWidth
                                SelectProps={{ MenuProps: premiumMenuProps }}
                            >
                                <MuiMenuItem value="payment">دفعة واردة</MuiMenuItem>
                                <MuiMenuItem value="expense">مصروف</MuiMenuItem>
                                <MuiMenuItem value="refund">استرداد</MuiMenuItem>
                            </MuiTextField>
                        </MuiGrid>

                        <MuiGrid item xs={12} sm={6}>
                            <MuiTextField
                                select
                                label="الفئة"
                                value={formData.category}
                                onChange={handleChange('category')}
                                required
                                fullWidth
                                SelectProps={{ MenuProps: premiumMenuProps }}
                            >
                                <MuiMenuItem value="event_payment">دفعة مناسبة</MuiMenuItem>
                                <MuiMenuItem value="staff_salary">راتب موظف</MuiMenuItem>
                                <MuiMenuItem value="maintenance">صيانة</MuiMenuItem>
                                <MuiMenuItem value="utilities">مرافق</MuiMenuItem>
                                <MuiMenuItem value="supplies">مستلزمات</MuiMenuItem>
                                <MuiMenuItem value="other">أخرى</MuiMenuItem>
                            </MuiTextField>
                        </MuiGrid>

                        <MuiGrid item xs={12}>
                            <MuiTextField
                                label="المبلغ"
                                type="number"
                                value={formData.amount}
                                onChange={handleChange('amount')}
                                required
                                fullWidth
                            />
                        </MuiGrid>

                        <MuiGrid item xs={12}>
                            <MuiTextField
                                select
                                label="طريقة الدفع"
                                value={formData.paymentMethod}
                                onChange={handleChange('paymentMethod')}
                                required
                                fullWidth
                                SelectProps={{ MenuProps: premiumMenuProps }}
                            >
                                <MuiMenuItem value="cash">نقدي</MuiMenuItem>
                                <MuiMenuItem value="bank_transfer">تحويل بنكي</MuiMenuItem>
                                <MuiMenuItem value="credit_card">بطاقة ائتمان</MuiMenuItem>
                                <MuiMenuItem value="check">شيك</MuiMenuItem>
                            </MuiTextField>
                        </MuiGrid>

                        <MuiGrid item xs={12} sm={6}>
                            <MuiTextField
                                label="رقم المرجع (اختياري)"
                                value={formData.reference}
                                onChange={handleChange('reference')}
                                fullWidth
                            />
                        </MuiGrid>

                        <MuiGrid item xs={12} sm={6}>
                            <MuiTextField
                                label="الوصف"
                                value={formData.description}
                                onChange={handleChange('description')}
                                fullWidth
                            />
                        </MuiGrid>

                        <MuiGrid item xs={12}>
                            <MuiTextField
                                label="ملاحظات"
                                value={formData.notes}
                                onChange={handleChange('notes')}
                                fullWidth
                                multiline
                                rows={2}
                            />
                        </MuiGrid>
                    </MuiGrid>

                    <MuiBox sx={{ display: 'flex', gap: 2, mt: 4 }}>
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
                            {loading ? 'جاري الحفظ...' : 'حفظ المعاملة'}
                        </MuiButton>
                        <MuiButton
                            type="button"
                            variant="outlined"
                            fullWidth
                            onClick={onClose}
                            sx={{
                                borderRadius: '12px',
                                py: 1.5,
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                color: 'var(--color-text-secondary)',
                                '&:hover': {
                                    borderColor: 'var(--color-text-primary)',
                                    color: 'var(--color-text-primary)',
                                    background: 'rgba(255, 255, 255, 0.05)'
                                }
                            }}
                        >
                            إلغاء
                        </MuiButton>
                    </MuiBox>
                </form>
            </MuiPaper>
        </MuiBox>
    )
}
