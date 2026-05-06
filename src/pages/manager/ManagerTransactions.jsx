// src\pages\manager\ManagerTransactions.jsx
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getFinancialTransactions, createFinancialTransaction, updateFinancialTransaction, getManagerEvents, getClients } from '@/api/manager'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiAvatar from '@/components/ui/MuiAvatar'
import { SEOHead, LoadingScreen, CrudPageLayout, StatusBadge } from '@/components/common'
import { useCRUD, useDialogState } from '@/hooks'
import { DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, Banknote } from 'lucide-react'
import { formatCurrency, formatDate } from '@/utils/helpers'
import TransactionDialog from './components/TransactionDialog'

export default function ManagerTransactions() {
    const [searchQuery, setSearchQuery] = useState('')
    const {
        selectedItem: selectedTransaction,
        openCreateDialog,
        openEditDialog,
        closeDialog,
        isCreate,
        isEdit,
    } = useDialogState()

    const {
        handleCreate,
        handleUpdate,
        isLoading: crudLoading,
    } = useCRUD({
        createFn: createFinancialTransaction,
        updateFn: updateFinancialTransaction,
        queryKey: ['financial-transactions'],
        successMessage: 'تمت العملية بنجاح',
    })

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['financial-transactions'],
        queryFn: () => getFinancialTransactions({ limit: 1000 }),
    })

    const transactions = useMemo(() => data?.data || data?.transactions || [], [data])

    const filteredTransactions = useMemo(() => {
        if (!searchQuery) return transactions
        const s = searchQuery.toLowerCase()
        return transactions.filter(t => 
            t.transactionId?.toLowerCase().includes(s) || 
            t.client?.name?.toLowerCase().includes(s) ||
            t.event?.name?.toLowerCase().includes(s)
        )
    }, [transactions, searchQuery])

    const columns = [
        {
            id: 'id',
            label: 'المعاملة',
            align: 'right',
            format: (value, row) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MuiAvatar sx={{ bgcolor: row.type === 'payment' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: row.type === 'payment' ? '#22c55e' : '#ef4444' }}>
                        {row.type === 'payment' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                    </MuiAvatar>
                    <MuiBox>
                        <MuiTypography variant="body2" sx={{ fontWeight: 700 }}>{row.transactionId || row.receiptNumber}</MuiTypography>
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>{row.type === 'payment' ? 'دفعة مقبوضة' : 'مصروف'}</MuiTypography>
                    </MuiBox>
                </MuiBox>
            )
        },
        {
            id: 'amount',
            label: 'المبلغ',
            align: 'center',
            format: (value) => (
                <MuiTypography variant="body2" sx={{ fontWeight: 700, color: 'var(--color-icon)' }}>
                    {formatCurrency(value)}
                </MuiTypography>
            )
        },
        {
            id: 'client',
            label: 'الطرف الثاني',
            align: 'center',
            format: (value, row) => row.client?.name || row.event?.name || '-'
        },
        {
            id: 'paymentMethod',
            label: 'طريقة الدفع',
            align: 'center',
            format: (value) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                    {value === 'cash' ? <Banknote size={14} /> : <CreditCard size={14} />}
                    <MuiTypography variant="body2">
                        {value === 'cash' ? 'نقدي' : value === 'bank_transfer' ? 'تحويل بنكي' : 'بطاقة ائتمان'}
                    </MuiTypography>
                </MuiBox>
            )
        },
        {
            id: 'processedAt',
            label: 'التاريخ',
            align: 'center',
            format: (value) => formatDate(value)
        },
        {
            id: 'status',
            label: 'الحالة',
            align: 'center',
            format: (value) => <StatusBadge status={value === 'completed' ? 'paid' : 'pending'} />
        }
    ]

    if (isLoading) return <LoadingScreen />

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
            <SEOHead title="إدارة المعاملات المالية | INVOCCA" />

            <CrudPageLayout
                stats={[
                    { title: 'إجمالي المقبوضات', value: formatCurrency(transactions.filter(t => t.type === 'payment').reduce((acc, curr) => acc + curr.amount, 0)), icon: <TrendingUp size={24} /> },
                    { title: 'إجمالي المصاريف', value: formatCurrency(transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0)), icon: <TrendingDown size={24} /> }
                ]}
                onSearch={setSearchQuery}
                onRefresh={refetch}
                columns={columns}
                data={filteredTransactions}
                loading={isLoading}
                onAdd={openCreateDialog}
                onEdit={openEditDialog}
                addButtonLabel="معاملة جديدة"
            />

            <TransactionDialog
                open={isCreate || isEdit}
                onClose={closeDialog}
                onSubmit={async (data) => {
                    const result = isEdit ? await handleUpdate(selectedTransaction._id, data) : await handleCreate(data)
                    if (result.success) closeDialog()
                }}
                transaction={selectedTransaction}
                loading={crudLoading}
            />
        </MuiBox>
    )
}

function TrendingUp(props) { return <ArrowUpRight {...props} style={{ color: '#22c55e' }} /> }
function TrendingDown(props) { return <ArrowDownRight {...props} style={{ color: '#ef4444' }} /> }
