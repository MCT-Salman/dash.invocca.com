// src\pages\manager\ClientsManagementNew.jsx
import { useState, useMemo } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useDebounce, useDialogState, useCRUD, useNotification } from '@/hooks'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiAvatar from '@/components/ui/MuiAvatar'
import { LoadingScreen, SEOHead, CrudPageLayout, StatusBadge } from '@/components/common'
import { QUERY_KEYS } from '@/config/constants'
import { getClients, deleteClient, createClient, updateClient, toggleClientStatus } from '@/api/manager'
import { formatDate } from '@/utils/helpers'
import ViewClientDialog from './components/ViewClientDialog'
import CreateEditClientDialog from './components/CreateEditClientDialog'
import { ConfirmDialog } from '@/components/common'
import {
    Users,
    Phone,
    Calendar,
    UserCheck,
    UserX,
} from 'lucide-react'

export default function ClientsManagement() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeFilters, setActiveFilters] = useState({})
    const debouncedSearch = useDebounce(searchQuery, 500)
    const queryClient = useQueryClient()
    const { success, error: showError } = useNotification()

    const {
        selectedItem: selectedClient,
        openCreateDialog,
        openEditDialog,
        openViewDialog,
        openDeleteDialog,
        closeDialog,
        isCreate,
        isEdit,
        isView,
        isDelete,
    } = useDialogState()

    const {
        handleCreate,
        handleUpdate,
        handleDelete,
        isLoading: crudLoading,
    } = useCRUD({
        createFn: createClient,
        updateFn: updateClient,
        deleteFn: deleteClient,
        queryKey: QUERY_KEYS.MANAGER_CLIENTS,
        successMessage: 'تمت العملية بنجاح',
        errorMessage: 'حدث خطأ أثناء العملية',
    })

    const { data: clientsData, isLoading, refetch } = useQuery({
        queryKey: QUERY_KEYS.MANAGER_CLIENTS,
        queryFn: getClients,
    })

    const toggleStatusMutation = useMutation({
        mutationFn: toggleClientStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MANAGER_CLIENTS })
            success(`تم تغيير حالة العميل بنجاح`)
        },
        onError: (err) => {
            showError(err?.response?.data?.message || 'فشل في تحديث حالة العميل')
        },
    })

    const clients = useMemo(() => {
        return clientsData?.clients || clientsData?.data || []
    }, [clientsData])

    const filteredClients = useMemo(() => {
        let filtered = Array.isArray(clients) ? clients : []
        if (debouncedSearch) {
            filtered = filtered.filter(client =>
                client.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                client.phone?.includes(debouncedSearch) ||
                client.email?.toLowerCase().includes(debouncedSearch.toLowerCase())
            )
        }
        return filtered
    }, [clients, debouncedSearch])

    const columns = [
        {
            id: 'name',
            label: 'العميل',
            align: 'right',
            format: (value, row) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MuiAvatar sx={{ bgcolor: 'var(--color-icon)', fontWeight: 700 }}>
                        {value?.charAt(0) || 'U'}
                    </MuiAvatar>
                    <MuiBox>
                        <MuiTypography variant="body2" sx={{ fontWeight: 700 }}>{value}</MuiTypography>
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>{row.email}</MuiTypography>
                    </MuiBox>
                </MuiBox>
            )
        },
        {
            id: 'phone',
            label: 'رقم الهاتف',
            align: 'center',
            format: (value) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                    <Phone size={14} style={{ color: 'var(--color-icon)' }} />
                    <MuiTypography variant="body2">{value || '-'}</MuiTypography>
                </MuiBox>
            )
        },
        {
            id: 'createdAt',
            label: 'تاريخ الانضمام',
            align: 'center',
            format: (value) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                    <Calendar size={14} style={{ color: 'var(--color-text-secondary)' }} />
                    <MuiTypography variant="body2">{formatDate(value)}</MuiTypography>
                </MuiBox>
            )
        },
        {
            id: 'isActive',
            label: 'الحالة',
            align: 'center',
            format: (value) => <StatusBadge value={value} activeLabel="نشط" inactiveLabel="معطل" />
        }
    ]

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
            <SEOHead title="إدارة العملاء | INVOCCA" />
            
            <CrudPageLayout
                stats={[
                    { title: 'إجمالي العملاء', value: clients.length, icon: <Users size={24} /> }
                ]}
                onSearch={setSearchQuery}
                onRefresh={refetch}
                columns={columns}
                data={filteredClients}
                loading={isLoading}
                onAdd={openCreateDialog}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
                onView={openViewDialog}
                onToggleStatus={(row) => toggleStatusMutation.mutate(row._id || row.id)}
                addButtonLabel="إضافة عميل"
            />

            <CreateEditClientDialog
                open={isCreate || isEdit}
                onClose={closeDialog}
                onSubmit={async (data) => {
                    const result = isEdit ? await handleUpdate(selectedClient._id, data) : await handleCreate(data)
                    if (result.success) closeDialog()
                }}
                editingClient={selectedClient}
                loading={crudLoading}
            />

            <ViewClientDialog
                open={isView}
                onClose={closeDialog}
                client={selectedClient}
                onToggleStatus={() => toggleStatusMutation.mutate(selectedClient._id)}
            />

            <ConfirmDialog
                open={isDelete}
                onClose={closeDialog}
                onConfirm={async () => {
                    const result = await handleDelete(selectedClient._id)
                    if (result.success) closeDialog()
                }}
                title="حذف عميل"
                message={`هل أنت متأكد من حذف العميل "${selectedClient?.name}"؟`}
                loading={crudLoading}
            />
        </MuiBox>
    )
}
