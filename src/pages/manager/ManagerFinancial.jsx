// src\pages\manager\ManagerFinancial.jsx
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce, useDialogState, useCRUD, useNotification } from '@/hooks'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import { LoadingScreen, SEOHead, CrudPageLayout, StatusBadge, ConfirmDialog } from '@/components/common'
import { QUERY_KEYS } from '@/config/constants'
import { getManagerInvoices, createManagerInvoice, updateManagerInvoice } from '@/api/manager'
import { formatCurrency, formatDate } from '@/utils/helpers'
import { FileText, DollarSign, Clock } from 'lucide-react'
import CreateEditInvoiceDialog from './components/CreateEditInvoiceDialog'

export default function ManagerFinancial() {
    const [searchQuery, setSearchQuery] = useState('')
    const {
        selectedItem: selectedInvoice,
        openCreateDialog,
        openEditDialog,
        openDeleteDialog,
        closeDialog,
        isCreate,
        isEdit,
        isDelete,
    } = useDialogState()

    const { data: invoicesData, isLoading, refetch } = useQuery({
        queryKey: QUERY_KEYS.MANAGER_INVOICES,
        queryFn: getManagerInvoices,
    })

    const invoices = useMemo(() => invoicesData?.invoices || invoicesData?.data || [], [invoicesData])

    const {
        handleCreate,
        handleUpdate,
        handleDelete,
        isLoading: crudLoading,
    } = useCRUD({
        createFn: createManagerInvoice,
        updateFn: updateManagerInvoice,
        deleteFn: null, // deleteInvoice not found in manager.js
        queryKey: QUERY_KEYS.MANAGER_INVOICES,
        successMessage: 'تمت العملية بنجاح',
    })

    const filteredInvoices = useMemo(() => {
        if (!searchQuery) return invoices
        return invoices.filter(inv => 
            inv.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inv.client?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [invoices, searchQuery])

    const columns = [
        {
            id: 'invoiceNumber',
            label: 'رقم الفاتورة',
            align: 'right',
            format: (value) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FileText size={20} style={{ color: 'var(--color-icon)' }} />
                    <MuiTypography variant="body2" sx={{ fontWeight: 700 }}>{value}</MuiTypography>
                </MuiBox>
            )
        },
        {
            id: 'client',
            label: 'العميل',
            align: 'center',
            format: (value) => value?.name || '-'
        },
        {
            id: 'totalAmount',
            label: 'المبلغ الإجمالي',
            align: 'center',
            format: (value) => formatCurrency(value)
        },
        {
            id: 'status',
            label: 'الحالة',
            align: 'center',
            format: (value) => <StatusBadge status={value} />
        },
        {
            id: 'dueDate',
            label: 'تاريخ الاستحقاق',
            align: 'center',
            format: (value) => formatDate(value)
        }
    ]

    if (isLoading) return <LoadingScreen />

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
            <SEOHead title="إدارة الفواتير | INVOCCA" />
            
            <CrudPageLayout
                stats={[
                    { title: 'إجمالي الفواتير', value: invoices.length, icon: <FileText size={24} /> },
                    { title: 'إجمالي المبالغ', value: formatCurrency(invoices.reduce((acc, curr) => acc + curr.totalAmount, 0)), icon: <DollarSign size={24} /> }
                ]}
                onSearch={setSearchQuery}
                onRefresh={refetch}
                columns={columns}
                data={filteredInvoices}
                loading={isLoading}
                onAdd={openCreateDialog}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
                addButtonLabel="فاتورة جديدة"
            />

            <CreateEditInvoiceDialog
                open={isCreate || isEdit}
                onClose={closeDialog}
                onSubmit={async (data) => {
                    const result = isEdit ? await handleUpdate(selectedInvoice._id, data) : await handleCreate(data)
                    if (result.success) closeDialog()
                }}
                editingInvoice={selectedInvoice}
                loading={crudLoading}
            />

            <ConfirmDialog
                open={isDelete}
                onClose={closeDialog}
                onConfirm={async () => {
                    const result = await handleDelete(selectedInvoice._id)
                    if (result.success) closeDialog()
                }}
                title="حذف فاتورة"
                message={`هل أنت متأكد من حذف فاتورة رقم "${selectedInvoice?.invoiceNumber}"؟`}
                loading={crudLoading}
            />
        </MuiBox>
    )
}
