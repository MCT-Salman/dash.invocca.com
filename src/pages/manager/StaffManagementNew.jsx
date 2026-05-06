// src\pages\manager\StaffManagementNew.jsx
import { useState, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDebounce, useDialogState, useCRUD, useNotification } from '@/hooks'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiAvatar from '@/components/ui/MuiAvatar'
import MuiChip from '@/components/ui/MuiChip'
import { LoadingScreen, SEOHead, CrudPageLayout } from '@/components/common'
import { QUERY_KEYS } from '@/config/constants'
import { getStaff, deleteStaff, addStaff, updateStaff } from '@/api/manager'
import { formatDate } from '@/utils/helpers'
import { Users, Phone, Briefcase, Calendar, Mail } from 'lucide-react'
import CreateEditStaffDialog from './components/CreateEditStaffDialog'
import ViewStaffDialog from './components/ViewStaffDialog'
import { ConfirmDialog } from '@/components/common'

export default function StaffManagement() {
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearch = useDebounce(searchQuery, 500)
    const { success, error: showError } = useNotification()

    const {
        selectedItem: selectedStaff,
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
        createFn: addStaff,
        updateFn: updateStaff,
        deleteFn: deleteStaff,
        queryKey: QUERY_KEYS.MANAGER_STAFF,
        successMessage: 'تمت العملية بنجاح',
    })

    const { data: staffData, isLoading, refetch } = useQuery({
        queryKey: QUERY_KEYS.MANAGER_STAFF,
        queryFn: getStaff,
    })

    const staffList = useMemo(() => {
        return staffData?.staff || staffData?.data || []
    }, [staffData])

    const filteredStaff = useMemo(() => {
        let filtered = Array.isArray(staffList) ? staffList : []
        if (debouncedSearch) {
            filtered = filtered.filter(member =>
                member.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                member.role?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                member.phone?.includes(debouncedSearch)
            )
        }
        return filtered
    }, [staffList, debouncedSearch])

    const columns = [
        {
            id: 'name',
            label: 'الموظف',
            align: 'right',
            format: (value, row) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MuiAvatar sx={{ bgcolor: 'var(--color-icon)', fontWeight: 700 }}>
                        {value?.charAt(0) || 'S'}
                    </MuiAvatar>
                    <MuiBox>
                        <MuiTypography variant="body2" sx={{ fontWeight: 700 }}>{value}</MuiTypography>
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>{row.email}</MuiTypography>
                    </MuiBox>
                </MuiBox>
            )
        },
        {
            id: 'role',
            label: 'الدور الوظيفي',
            align: 'center',
            format: (value) => (
                <MuiChip
                    label={value === 'admin' ? 'مدير' : value === 'staff' ? 'موظف' : value}
                    size="small"
                    sx={{ bgcolor: 'color-mix(in srgb, var(--color-gold) 10%, transparent)', color: 'var(--color-icon)', fontWeight: 600 }}
                />
            )
        },
        {
            id: 'phone',
            label: 'رقم الهاتف',
            align: 'center',
            format: (value) => value || '-'
        }
    ]

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
            <SEOHead title="إدارة الموظفين | INVOCCA" />
            
            <CrudPageLayout
                stats={[
                    { title: 'إجمالي الموظفين', value: staffList.length, icon: <Users size={24} /> }
                ]}
                onSearch={setSearchQuery}
                onRefresh={refetch}
                columns={columns}
                data={filteredStaff}
                loading={isLoading}
                onAdd={openCreateDialog}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
                onView={openViewDialog}
                addButtonLabel="إضافة موظف"
            />

            <CreateEditStaffDialog
                open={isCreate || isEdit}
                onClose={closeDialog}
                onSubmit={async (data) => {
                    const result = isEdit ? await handleUpdate(selectedStaff._id, data) : await handleCreate(data)
                    if (result.success) closeDialog()
                }}
                editingStaff={selectedStaff}
                loading={crudLoading}
            />

            <ViewStaffDialog
                open={isView}
                onClose={closeDialog}
                staff={selectedStaff}
            />

            <ConfirmDialog
                open={isDelete}
                onClose={closeDialog}
                onConfirm={async () => {
                    const result = await handleDelete(selectedStaff._id)
                    if (result.success) closeDialog()
                }}
                title="حذف موظف"
                message={`هل أنت متأكد من حذف الموظف "${selectedStaff?.name}"؟`}
                loading={crudLoading}
            />
        </MuiBox>
    )
}
