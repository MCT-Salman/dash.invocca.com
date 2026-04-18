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
import { LoadingScreen, EmptyState, SEOHead, PageHeader, StatCard, DataTable, ConfirmDialog } from '@/components/common'
import ViewUserDialog from './components/ViewUserDialog'
import EditUserDialog from './components/EditUserDialog'
import CreateAdminDialog from './components/CreateAdminDialog'

// Hooks & Utilities
import { useDebounce, useDialogState, useNotification } from '@/hooks'
import { QUERY_KEYS, USER_ROLES } from '@/config/constants'
import { getUsers, toggleUserStatus, deleteUser } from '@/api/admin'
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
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 500)

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

    // Fetch Users
    const { data: usersData, isLoading, error, refetch } = useQuery({
        queryKey: QUERY_KEYS.ADMIN_USERS,
        queryFn: () => getUsers(),
    })

    const users = usersData?.users || usersData?.data || []

    // Filter managers (users with hallId)
    const filteredManagers = useMemo(() => {
        let filtered = Array.isArray(users) ? users : []
        
        // Filter to only get users with hallId (managers)
        filtered = filtered.filter(user => user.hallId && (user.hallId._id || user.hallId))

        if (debouncedSearch) {
            filtered = filtered.filter(user =>
                user.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                user.phone?.includes(debouncedSearch) ||
                user.hallId?.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
            )
        }

        return filtered
    }, [users, debouncedSearch])

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
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_USERS })
            const user = users.find(u => u._id === userId)
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
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_USERS })
            success('تم حذف المستخدم بنجاح')
            closeDialog()
        } catch (err) {
            showError(err?.response?.data?.message || err?.message || 'فشل في حذف المستخدم')
        }
    }

    const handleEditSuccess = () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_USERS })
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

            {/* Search */}
            <MuiPaper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    background: 'var(--color-paper)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '16px'
                }}
            >
                <MuiGrid container spacing={2} alignItems="center">
                    <MuiGrid item xs={12} md={12}>
                        <MuiTextField
                            fullWidth
                            placeholder="البحث بالاسم، الهاتف، أو اسم الصالة..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            startIcon={<Search size={20} />}
                        />
                    </MuiGrid>
                </MuiGrid>
            </MuiPaper>

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
