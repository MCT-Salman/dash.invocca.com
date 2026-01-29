import { useState, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
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
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'

// Layout & Common Components
import { LoadingScreen, EmptyState, ConfirmDialog, SEOHead, DataTable, PageHeader, StatCard } from '@/components/common'
import ViewManagerDialog from './components/ViewManagerDialog'
import CreateEditManagerDialog from './components/CreateEditManagerDialog'

// Hooks & Utilities
import { useDebounce, useDialogState, useCRUD, useNotification } from '@/hooks'
import { QUERY_KEYS } from '@/config/constants'
import { getManagers, deleteManager, toggleManagerStatus, createManager, updateManager, getHallsList } from '@/api/admin'
import { formatPhoneNumber } from '@/utils/helpers'

// Icons
import {
    User,
    Search,
    RefreshCw,
    CheckCircle,
    XCircle,
    Phone,
    Building2,
    Plus
} from 'lucide-react'

// ====================== Main Component ======================
export default function ManagersManagement() {
    // State Management
    const [managers, setManagers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    // Hooks
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const debouncedSearch = useDebounce(searchTerm, 500)
    const { addNotification: showNotification } = useNotification()

    // Dialog state management
    const {
        selectedItem: selectedManager,
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

    // CRUD operations
    const {
        handleCreate,
        handleUpdate,
        handleDelete,
        isLoading: crudLoading,
    } = useCRUD({
        createFn: createManager,
        updateFn: updateManager,
        deleteFn: deleteManager,
        queryKey: QUERY_KEYS.ADMIN_MANAGERS,
        successMessage: 'تمت العملية بنجاح',
        errorMessage: 'حدث خطأ أثناء العملية',
        onSuccess: () => {
            fetchManagers()
        },
    })

    // Fetch Managers Function
    const fetchManagers = async () => {
        try {
            setLoading(true)
            const response = await getManagers()
            let managersData = []

            if (Array.isArray(response)) {
                managersData = response
            } else if (response?.data) {
                if (Array.isArray(response.data)) {
                    managersData = response.data
                } else if (response.data?.managers && Array.isArray(response.data.managers)) {
                    managersData = response.data.managers
                }
            } else if (response?.managers && Array.isArray(response.managers)) {
                managersData = response.managers
            }

            setManagers(managersData)
            setError(null)
        } catch (err) {
            setError('حدث خطأ في جلب بيانات المدراء')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchManagers()
    }, [])

    const filteredManagers = useMemo(() => {
        let filtered = Array.isArray(managers) ? managers : []
        if (debouncedSearch) {
            filtered = filtered.filter(m =>
                m.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                m.phone?.includes(debouncedSearch) ||
                (m.hallId?.name || m.hallName)?.toLowerCase().includes(debouncedSearch.toLowerCase())
            )
        }
        if (statusFilter !== 'all') {
            filtered = filtered.filter(m => statusFilter === 'active' ? m.isActive !== false : m.isActive === false)
        }
        return filtered
    }, [managers, debouncedSearch, statusFilter])

    const columns = [
        {
            id: 'name',
            label: 'المدير',
            align: 'right',
            format: (value, row) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MuiAvatar
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
                            {row.username || 'بدون اسم مستخدم'}
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
            label: 'قاعة/صالة المسؤول عنها',
            align: 'right',
            format: (value, row) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Building2 size={14} style={{ color: 'var(--color-primary-500)' }} />
                    <MuiTypography variant="body2" sx={{ fontWeight: 500 }}>
                        {value?.name || row.hallName || 'غير معين'}
                    </MuiTypography>
                </MuiBox>
            )
        },
        {
            id: 'isActive',
            label: 'الحالة',
            align: 'center',
            format: (value) => (
                <MuiChip
                    label={value !== false ? 'نشط' : 'معطل'}
                    size="small"
                    color={value !== false ? 'success' : 'error'}
                    variant="filled"
                    icon={value !== false ? <CheckCircle size={14} /> : <XCircle size={14} />}
                />
            )
        }
    ]

    const handleToggleStatus = async (row) => {
        try {
            const id = row._id || row.id
            if (!id) return
            await toggleManagerStatus(id)
            await fetchManagers()
            showNotification({
                title: 'تم التحديث',
                message: `تم تغيير حالة المدير "${row.name}" بنجاح`,
                type: 'success'
            })
        } catch (err) {
            showNotification({ title: 'خطأ', message: 'فشل في تحديث حالة المدير', type: 'error' })
        }
    }

    const handleCreateSubmit = async (data) => {
        await handleCreate(data)
        closeDialog()
    }

    const handleUpdateSubmit = async (data) => {
        const id = selectedManager?._id || selectedManager?.id
        if (!id) return
        await handleUpdate(id, data)
        closeDialog()
    }

    const handleDeleteConfirm = async () => {
        const id = selectedManager?._id || selectedManager?.id
        if (!id) return
        await handleDelete(id)
        closeDialog()
    }

    if (loading) return <LoadingScreen />

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
            <SEOHead title="إدارة المدراء | INVOCCA" />

            <PageHeader
                icon={User}
                title={`إدارة المدراء (${filteredManagers.length})`}
                subtitle="إدارة حسابات مدراء قاعة/صالة وربطهم مع القاعات"
                actions={
                    <MuiButton
                        variant="contained"
                        start_icon={<Plus size={18} />}
                        onClick={() => openCreateDialog()}
                    >
                        إضافة مدير جديد
                    </MuiButton>
                }
            />

            {/* Stats Cards */}
            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard title="عدد المدراء" value={managers.length} icon={<User size={24} />} />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="المدراء النشطون"
                        value={managers.filter(m => m.isActive !== false).length}
                        icon={<CheckCircle size={24} />}
                        sx={{ borderTop: '4px solid var(--color-success-500)' }}
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="مع قاعة/صالة"
                        value={managers.filter(m => m.hallId).length}
                        icon={<Building2 size={24} />}
                        sx={{ borderTop: '4px solid var(--color-secondary-500)' }}
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="بدون قاعة/صالة"
                        value={managers.filter(m => !m.hallId).length}
                        icon={<XCircle size={24} />}
                        sx={{ borderTop: '4px solid var(--color-warning-500)' }}
                    />
                </MuiGrid>
            </MuiGrid>

            {/* Search & Filter */}
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
                    <MuiGrid item xs={12} md={8}>
                        <MuiTextField
                            fullWidth
                            placeholder="البحث بالاسم، الهاتف، أو اسم قاعة/صالة..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            startIcon={<Search size={20} />}
                        />
                    </MuiGrid>
                    <MuiGrid item xs={12} md={4}>
                        <MuiSelect
                            fullWidth
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            options={[
                                { label: 'الكل', value: 'all' },
                                { label: 'نشط', value: 'active' },
                                { label: 'معطل', value: 'inactive' }
                            ]}
                        />
                    </MuiGrid>
                </MuiGrid>
            </MuiPaper>

            {/* Content */}
            {filteredManagers.length === 0 ? (
                <EmptyState title="لا يوجد مدراء" description="لم يتم العثور على أي مدراء" icon={User} showPaper />
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

            {/* Dialogs */}
            <CreateEditManagerDialog
                open={isCreate || isEdit}
                onClose={closeDialog}
                onSubmit={isEdit ? handleUpdateSubmit : handleCreateSubmit}
                editingManager={isEdit ? selectedManager : null}
            />

            <ViewManagerDialog open={isView} onClose={closeDialog} manager={selectedManager} />

            <ConfirmDialog
                open={isDelete}
                onClose={closeDialog}
                onConfirm={handleDeleteConfirm}
                title="حذف المدير"
                message={`هل أنت متأكد من حذف المدير "${selectedManager?.name}"؟`}
                confirmLabel="حذف"
                loading={crudLoading}
            />
        </MuiBox>
    )
}
