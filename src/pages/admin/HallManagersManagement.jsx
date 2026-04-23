import { useState, useMemo } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useTheme, useMediaQuery } from '@mui/material'

// MUI Components
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiButton from '@/components/ui/MuiButton'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiChip from '@/components/ui/MuiChip'
import MuiAvatar from '@/components/ui/MuiAvatar'

// Layout & Common Components
import { LoadingScreen, EmptyState, SEOHead, PageHeader, StatCard, DataTable, ConfirmDialog, AdvancedFilter } from '@/components/common'
import ViewUserDialog from './components/ViewUserDialog'
import EditUserDialog from './components/EditUserDialog'
import CreateAdminDialog from './components/CreateAdminDialog'

// Hooks & Utilities
import { useDebounce, useDialogState, useNotification } from '@/hooks'
import { QUERY_KEYS, USER_ROLES } from '@/config/constants'
import { getManagers, toggleUserStatus, deleteUser } from '@/api/admin'
import { formatPhoneNumber } from '@/utils/helpers'

// Icons
import {
    Users,
    Search,
    RefreshCw,
    Building2,
    User,
    Shield,
    Phone,
    CheckCircle,
    XCircle,
    Plus
} from 'lucide-react'

// ====================== Main Component ======================
export default function HallManagersManagement() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const queryClient = useQueryClient()
    const { success, error: showError } = useNotification()

    // State
    const [searchQuery, setSearchQuery] = useState('')
    const [activeFilters, setActiveFilters] = useState({})
    const debouncedSearch = useDebounce(searchQuery, 500)

    // Dialog state management
    const {
        dialogOpen,
        dialogType,
        selectedItem: selectedUser,
        openCreateDialog,
        openViewDialog,
        openEditDialog,
        openDeleteDialog,
        closeDialog,
        isCreate,
        isEdit,
        isView,
        isDelete,
    } = useDialogState()

    // Fetch Managers
    const { data: managersData, isLoading, error, refetch } = useQuery({
        queryKey: QUERY_KEYS.ADMIN_MANAGERS,
        queryFn: () => getManagers(),
    })

    const managers = managersData?.managers || managersData?.data?.managers || managersData?.data || []

    // Get unique halls for filter
    const uniqueHalls = useMemo(() => {
        const halls = managers.map(m => m.hallId?.name).filter(Boolean)
        return [...new Set(halls)]
    }, [managers])

    // Filter configuration for AdvancedFilter
    const filterConfig = useMemo(() => {
        const hallOptions = uniqueHalls.map(hall => ({ value: hall, label: hall }))
        return [
            {
                key: 'hall',
                label: 'الصالة/القاعة',
                type: 'select',
                options: hallOptions
            },
            {
                key: 'status',
                label: 'الحالة',
                type: 'select',
                options: [
                    { value: 'active', label: 'نشط' },
                    { value: 'inactive', label: 'معطل' }
                ]
            },
            {
                key: 'createdAt',
                label: 'تاريخ الإنشاء',
                type: 'dateRange'
            }
        ]
    }, [uniqueHalls])

    // Filter managers
    const filteredManagers = useMemo(() => {
        let filtered = Array.isArray(managers) ? managers : []

        // Filter by search term
        filtered = filtered.filter(manager => manager.hallId && (manager.hallId._id || manager.hallId))

        if (debouncedSearch) {
            filtered = filtered.filter(user =>
                user.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                user.phone?.includes(debouncedSearch) ||
                user.hallId?.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
            )
        }

        // Apply hall filter
        if (activeFilters.hall) {
            filtered = filtered.filter(manager => manager.hallId?.name === activeFilters.hall)
        }

        // Apply status filter
        if (activeFilters.status) {
            filtered = filtered.filter(manager => {
                if (activeFilters.status === 'active') return manager.isActive !== false
                if (activeFilters.status === 'inactive') return manager.isActive === false
                return true
            })
        }

        // Apply date range filter
        if (activeFilters.dateFrom || activeFilters.dateTo) {
            filtered = filtered.filter(manager => {
                if (!manager.createdAt) return false
                const managerDate = new Date(manager.createdAt)
                const fromDate = activeFilters.dateFrom ? new Date(activeFilters.dateFrom) : null
                const toDate = activeFilters.dateTo ? new Date(activeFilters.dateTo) : null

                // Set toDate to end of day to include the selected date
                if (toDate) {
                    toDate.setHours(23, 59, 59, 999)
                }

                if (fromDate && managerDate < fromDate) return false
                if (toDate && managerDate > toDate) return false

                return true
            })
        }

        return filtered
    }, [managers, debouncedSearch, activeFilters])

    // Table Columns - Same style as UsersManagement
    const columns = [
        {
            id: 'name',
            label: 'المدير',
            align: 'right',
            format: (value, row) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MuiAvatar
                        src={row.avatar || row.image ? ((row.avatar || row.image).startsWith('http') ? (row.avatar || row.image) : `${import.meta.env.VITE_API_BASE}${(row.avatar || row.image)}`) : undefined}
                        sx={{
                            width: 36,
                            height: 36,
                            background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                            color: 'var(--color-text-on-primary)',
                            fontWeight: 600,
                            fontSize: '0.8rem'
                        }}
                    >
                        {value?.charAt(0).toUpperCase() || 'M'}
                    </MuiAvatar>
                    <MuiBox>
                        <MuiTypography variant="body2" sx={{ fontWeight: 600 }}>
                            {value}
                        </MuiTypography>
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                            {row.username || '—'}
                        </MuiTypography>
                    </MuiBox>
                </MuiBox>
            )
        },
        {
            id: 'phone',
            label: 'رقم الهاتف',
            align: 'right',
            format: (value) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone size={14} style={{ color: 'var(--color-primary-500)' }} />
                    <MuiTypography variant="body2">{formatPhoneNumber(value) || value || '---'}</MuiTypography>
                </MuiBox>
            )
        },
        {
            id: 'hallId',
            label: 'الصالة/القاعة',
            align: 'right',
            format: (value) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Building2 size={14} style={{ color: 'var(--color-primary-500)' }} />
                    <MuiTypography variant="body2">{value?.name || '—'}</MuiTypography>
                </MuiBox>
            )
        },
        {
            id: 'isActive',
            label: 'الحالة',
            align: 'center',
            format: (value) => (
                <MuiChip
                    label={value ? 'نشط' : 'معطل'}
                    size="small"
                    color={value ? 'success' : 'error'}
                    variant="filled"
                    icon={value ? <CheckCircle size={14} /> : <XCircle size={14} />}
                />
            )
        }
    ]

    // Toggle status mutation
    const toggleStatusMutation = useMutation({
        mutationFn: toggleUserStatus,
        onSuccess: (_, userId) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_MANAGERS })
            const user = managers.find(u => u._id === userId)
            success(`تم ${user?.isActive ? 'إلغاء تفعيل' : 'تفعيل'} المستخدم بنجاح`)
        },
        onError: (err) => {
            showError(err?.response?.data?.message || err?.message || 'فشل في تحديث حالة المستخدم')
        },
    })

    const handleToggleStatus = async (user) => {
        await toggleStatusMutation.mutateAsync(user._id)
    }

    const handleDeleteConfirm = async () => {
        const id = selectedUser?._id || selectedUser?.id
        if (!id) return
        try {
            await deleteUser(id)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_MANAGERS })
            success('تم حذف المستخدم بنجاح')
            closeDialog()
        } catch (err) {
            showError(err?.response?.data?.message || err?.message || 'فشل في حذف المستخدم')
        }
    }

    const handleEditSuccess = () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_MANAGERS })
        success('تم تحديث بيانات المستخدم بنجاح')
    }

    const handleRefresh = () => {
        refetch()
        success('تم تحديث البيانات بنجاح')
    }

    if (isLoading) return <LoadingScreen message="جاري تحميل مدراء الصالات..." />

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
            <SEOHead title="مدراء الصالات | INVOCCA" />

            <PageHeader
                icon={Users}
                title={`مدراء الصالات (${filteredManagers.length})`}
                subtitle="إدارة مدراء الصالات والقاعات في النظام"
                actions={
                    <MuiBox sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <MuiButton
                            variant="contained"
                            startIcon={<Plus size={18} />}
                            onClick={() => openCreateDialog()}
                        >
                            إضافة مدير
                        </MuiButton>
                        <MuiButton
                            variant="outlined"
                            startIcon={<RefreshCw size={18} />}
                            onClick={handleRefresh}
                        >
                            تحديث
                        </MuiButton>
                    </MuiBox>
                }
            />

            {/* Stats Cards */}
            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                <MuiGrid item xs={12} sm={6}>
                    <StatCard
                        title="إجمالي مدراء الصالات"
                        value={filteredManagers.length}
                        icon={<Shield size={24} />}
                        sx={{ borderTop: '4px solid var(--color-secondary-500)' }}
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6}>
                    <StatCard
                        title="المدراء النشطون"
                        value={filteredManagers.filter(m => m.isActive !== false).length}
                        icon={<CheckCircle size={24} />}
                        color="success"
                    />
                </MuiGrid>
            </MuiGrid>

            {/* Advanced Filter */}
            <AdvancedFilter
                onSearch={setSearchQuery}
                onFilterChange={setActiveFilters}
                filters={filterConfig}
                onRefresh={refetch}
                searchPlaceholder="بحث..."
            />

            {/* Managers Table */}
            {filteredManagers.length === 0 ? (
                <EmptyState
                    title="لا يوجد مدراء صالات"
                    description="لم يتم العثور على أي مدراء صالات يطابقون بحثك"
                    icon={Users}
                    showPaper
                />
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredManagers}
                    onView={openViewDialog}
                    onEdit={openEditDialog}
                    onDelete={openDeleteDialog}
                    onToggleStatus={handleToggleStatus}
                />
            )}

            {/* View User Dialog */}
            <ViewUserDialog
                open={isView}
                onClose={closeDialog}
                user={selectedUser}
            />

            {/* Create Admin Dialog */}
            <CreateAdminDialog
                open={isCreate}
                onClose={closeDialog}
                onSubmit={(form) => {
                    // Handle create
                    closeDialog()
                }}
                loading={false}
            />

            {/* Edit User Dialog */}
            <EditUserDialog
                open={isEdit}
                onClose={closeDialog}
                user={selectedUser}
                onSuccess={handleEditSuccess}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={isDelete}
                onClose={closeDialog}
                onConfirm={handleDeleteConfirm}
                title="حذف المدير"
                message={`هل أنت متأكد من حذف المدير "${selectedUser?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
                confirmLabel="حذف"
                cancelLabel="إلغاء"
            />
        </MuiBox>
    )
}
