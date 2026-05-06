// src\pages\manager\ServicesManagement.jsx
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import { LoadingScreen, SEOHead, CrudPageLayout, StatusBadge, ConfirmDialog } from '@/components/common'
import { QUERY_KEYS } from '@/config/constants'
import { getHallServices, deleteHallService, addHallService, updateHallService } from '@/api/manager'
import { useDialogState, useCRUD } from '@/hooks'
import { Package, Plus } from 'lucide-react'
import CreateEditServiceDialog from './components/CreateEditServiceDialog'

export default function ServicesManagement() {
    const [searchQuery, setSearchQuery] = useState('')
    const {
        selectedItem: selectedService,
        openCreateDialog,
        openEditDialog,
        openDeleteDialog,
        closeDialog,
        isCreate,
        isEdit,
        isDelete,
    } = useDialogState()

    const { data: servicesData, isLoading, refetch } = useQuery({
        queryKey: QUERY_KEYS.MANAGER_SERVICES,
        queryFn: getHallServices,
    })

    const services = useMemo(() => servicesData?.services || servicesData?.data || [], [servicesData])

    const {
        handleCreate,
        handleUpdate,
        handleDelete,
        isLoading: crudLoading,
    } = useCRUD({
        createFn: addHallService,
        updateFn: updateHallService,
        deleteFn: deleteHallService,
        queryKey: QUERY_KEYS.MANAGER_SERVICES,
        successMessage: 'تمت العملية بنجاح',
    })

    const filteredServices = useMemo(() => {
        if (!searchQuery) return services
        return services.filter(s => s.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    }, [services, searchQuery])

    const columns = [
        {
            id: 'name',
            label: 'الخدمة',
            align: 'right',
            format: (value) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Package size={20} style={{ color: 'var(--color-icon)' }} />
                    <MuiTypography variant="body2" sx={{ fontWeight: 700 }}>{value}</MuiTypography>
                </MuiBox>
            )
        },
        {
            id: 'price',
            label: 'السعر',
            align: 'center',
            format: (value) => `${value?.toLocaleString()} ل.س`
        },
        {
            id: 'isActive',
            label: 'الحالة',
            align: 'center',
            format: (value) => <StatusBadge value={value} activeLabel="نشط" inactiveLabel="معطل" />
        }
    ]

    if (isLoading) return <LoadingScreen />

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
            <SEOHead title="إدارة الخدمات | INVOCCA" />
            
            <CrudPageLayout
                stats={[
                    { title: 'إجمالي الخدمات', value: services.length, icon: <Package size={24} /> }
                ]}
                onSearch={setSearchQuery}
                onRefresh={refetch}
                columns={columns}
                data={filteredServices}
                loading={isLoading}
                onAdd={openCreateDialog}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
                addButtonLabel="خدمة جديدة"
            />

            <CreateEditServiceDialog
                open={isCreate || isEdit}
                onClose={closeDialog}
                onSubmit={async (data) => {
                    const result = isEdit ? await handleUpdate(selectedService._id, data) : await handleCreate(data)
                    if (result.success) closeDialog()
                }}
                editingService={selectedService}
                loading={crudLoading}
            />

            <ConfirmDialog
                open={isDelete}
                onClose={closeDialog}
                onConfirm={async () => {
                    const result = await handleDelete(selectedService._id)
                    if (result.success) closeDialog()
                }}
                title="حذف خدمة"
                message={`هل أنت متأكد من حذف خدمة "${selectedService?.name}"؟`}
                loading={crudLoading}
            />
        </MuiBox>
    )
}
