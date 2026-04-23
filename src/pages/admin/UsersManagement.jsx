import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
import MuiInputAdornment from '@/components/ui/MuiInputAdornment'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiTabs from '@mui/material/Tabs'
import MuiTab from '@mui/material/Tab'
import Box from '@mui/material/Box'

// Layout & Common Components
import { LoadingScreen, EmptyState, SEOHead, DataTable, ConfirmDialog, PageHeader, StatCard, AdvancedFilter } from '@/components/common'
import ViewUserDialog from './components/ViewUserDialog'
import CreateAdminDialog from './components/CreateAdminDialog'
import EditUserDialog from './components/EditUserDialog'

// Hooks & Utilities
import { useDebounce, useDialogState, useCRUD, useNotification } from '@/hooks'
import { QUERY_KEYS, USER_ROLES } from '@/config/constants'
import { getUsers, deleteUser, toggleUserStatus } from '@/api/admin'
import api from '@/api/apiClient'

// Icons
import {
  Users,
  Search,
  Shield,
  User,
  Phone,
  RefreshCw,
  Plus,
  CheckCircle,
  XCircle
} from 'lucide-react'

// ====================== Roles Badge ======================
const UserRoleBadge = ({ role }) => {
  // Handle role as array or string
  const roles = Array.isArray(role) ? role : [role]
  
  const roleConfig = {
    [USER_ROLES.ADMIN]: { label: 'مدير نظام', color: 'error', icon: Shield },
    [USER_ROLES.MANAGER]: { label: 'مدير قاعة/صالة', color: 'secondary', icon: Users },
    [USER_ROLES.CLIENT]: { label: 'عميل', color: 'info', icon: User },
    [USER_ROLES.EMPLOYEE]: { label: 'موظف', color: 'success', icon: Users }
  }

  // Get primary role (first match)
  const primaryRole = roles.find(r => roleConfig[r]) || USER_ROLES.CLIENT
  const config = roleConfig[primaryRole] || roleConfig[USER_ROLES.CLIENT]
  const Icon = config.icon

  return (
    <MuiChip
      icon={<Icon size={14} />}
      label={config.label}
      size="small"
      color={config.color}
      variant="filled"
    />
  )
}

// ====================== Main Component ======================
export default function UsersManagement() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const queryClient = useQueryClient()
  const { success, error: showError } = useNotification()

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState({})
  const debouncedSearch = useDebounce(searchQuery, 500)
  // Show only admins by default
  const [roleFilter, setRoleFilter] = useState(USER_ROLES.ADMIN)

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
    isView,
    isEdit,
    isDelete,
  } = useDialogState()

  // CRUD operations
  const {
    deleteMutation,
    handleDelete,
    isLoading: crudLoading,
  } = useCRUD({
    createFn: null,
    updateFn: null,
    deleteFn: deleteUser,
    queryKey: QUERY_KEYS.ADMIN_USERS,
    successMessage: 'تم حذف المستخدم بنجاح',
    errorMessage: 'حدث خطأ أثناء حذف المستخدم',
  })

  // Fetch Users
  const { data: usersData, isLoading, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_USERS,
    queryFn: () => getUsers(),
  })

  const users = usersData?.users || usersData?.data || []

  // Filter configuration for AdvancedFilter
  const filterConfig = useMemo(() => {
    return [
      {
        key: 'role',
        label: 'الدور',
        type: 'select',
        options: [
          { value: USER_ROLES.ADMIN, label: 'مدير نظام' },
          { value: USER_ROLES.MANAGER, label: 'مدير قاعة/صالة' },
          { value: USER_ROLES.CLIENT, label: 'عميل' },
          { value: USER_ROLES.EMPLOYEE, label: 'موظف' }
        ]
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
  }, [])

  // Filtered Users
  const filteredUsers = useMemo(() => {
    let filtered = Array.isArray(users) ? users : []

    if (debouncedSearch) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        user.phone?.includes(debouncedSearch) ||
        user.email?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    }

    // Apply role filter from activeFilters
    if (activeFilters.role && activeFilters.role !== 'all') {
      filtered = filtered.filter(user => {
        const userRoles = Array.isArray(user.role) ? user.role : [user.role]
        return userRoles.includes(activeFilters.role)
      })
    }

    // Apply status filter from activeFilters
    if (activeFilters.status) {
      filtered = filtered.filter(user => {
        if (activeFilters.status === 'active') return user.isActive !== false
        if (activeFilters.status === 'inactive') return user.isActive === false
        return true
      })
    }

    // Apply date range filter
    if (activeFilters.dateFrom || activeFilters.dateTo) {
      filtered = filtered.filter(user => {
        if (!user.createdAt) return false
        const userDate = new Date(user.createdAt)
        const fromDate = activeFilters.dateFrom ? new Date(activeFilters.dateFrom) : null
        const toDate = activeFilters.dateTo ? new Date(activeFilters.dateTo) : null

        // Set toDate to end of day to include the selected date
        if (toDate) {
          toDate.setHours(23, 59, 59, 999)
        }

        if (fromDate && userDate < fromDate) return false
        if (toDate && userDate > toDate) return false

        return true
      })
    }

    // Apply default role filter for admins
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => {
        const userRoles = Array.isArray(user.role) ? user.role : [user.role]
        return userRoles.includes(roleFilter)
      })
    }

    return filtered
  }, [users, debouncedSearch, activeFilters, roleFilter])

  // Table Columns
  const columns = [
    {
      id: 'name',
      label: 'المستخدم',
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
            {value?.charAt(0).toUpperCase() || 'U'}
          </MuiAvatar>
          <MuiBox>
            <MuiTypography variant="body2" sx={{ fontWeight: 600 }}>
              {value}
            </MuiTypography>
            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
              {row.email || '—'}
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
          <MuiTypography variant="body2">{value || '---'}</MuiTypography>
        </MuiBox>
      )
    },
    {
      id: 'role',
      label: 'الدور',
      align: 'center',
      format: (value) => <UserRoleBadge role={value} />
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

  const addAdminMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post('/admin/users/add', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return res.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_USERS })
      success(data?.message || 'تم إضافة المستخدم بنجاح')
      closeDialog()
    },
    onError: (err) => {
      showError(err?.response?.data?.message || err?.message || 'فشل في إضافة المستخدم')
    }
  })

  // Toggle status mutation (separate from CRUD)
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
    await handleDelete(id)
    closeDialog()
  }

  const handleEditSuccess = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_USERS })
    success('تم تحديث بيانات المستخدم بنجاح')
  }

  if (isLoading) return <LoadingScreen message="جاري تحميل المستخدمين..." />

  return (
    <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
      <SEOHead title="إدارة المستخدمين | INVOCCA" />

      <PageHeader
        icon={Shield}
        title={`مدراء النظام (${filteredUsers.length})`}
        subtitle="إدارة حسابات مدراء النظام وصلاحياتهم"
        actions={
          <MuiBox sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <MuiButton
              variant="contained"
              start_icon={<Plus size={18} />}
              onClick={() => openCreateDialog()}
            >
              إضافة مدير نظام
            </MuiButton>
            <MuiButton
              variant="outlined"
              start_icon={<RefreshCw size={18} />}
              onClick={() => refetch()}
            >
              تحديث
            </MuiButton>
          </MuiBox>
        }
      />

      {/* Stats Cards - Admin Focused */}
      <MuiGrid container spacing={3} sx={{ mb: 4 }}>
        <MuiGrid item xs={12} sm={6}>
          <StatCard
            title="إجمالي مدراء النظام"
            value={users.filter(u => {
              const roles = Array.isArray(u.role) ? u.role : [u.role]
              return roles.includes(USER_ROLES.ADMIN)
            }).length}
            icon={<Shield size={24} />}
            sx={{ borderTop: '4px solid var(--color-error-500)' }}
          />
        </MuiGrid>
        <MuiGrid item xs={12} sm={6}>
          <StatCard
            title="المدراء النشطون"
            value={users.filter(u => {
              const roles = Array.isArray(u.role) ? u.role : [u.role]
              return roles.includes(USER_ROLES.ADMIN) && u.isActive !== false
            }).length}
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

      {/* Tabs hidden - only showing admins */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, display: 'none' }}>
        <MuiTabs
          value={USER_ROLES.ADMIN}
          sx={{
            '& .MuiTab-root': {
              color: 'var(--color-text-secondary)',
              fontWeight: 'bold',
              fontSize: '1rem',
              '&.Mui-selected': {
                color: 'var(--color-primary-500)',
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'var(--color-primary-500)',
            }
          }}
        >
          <MuiTab label="مدراء النظام" value={USER_ROLES.ADMIN} />
        </MuiTabs>
      </Box>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <EmptyState
          title="لا يوجد مستخدمين"
          description="لم يتم العثور على أي مستخدمين يطابقون بحثك"
          icon={Users}
          showPaper
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredUsers}
          onView={openViewDialog}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* User View Dialog */}
      <ViewUserDialog
        open={isView}
        onClose={closeDialog}
        user={selectedUser}
      />

      {/* Create Admin Dialog */}
      <CreateAdminDialog
        open={isCreate}
        onClose={closeDialog}
        onSubmit={(form) => addAdminMutation.mutateAsync(form)}
        loading={addAdminMutation.isPending}
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
        title="حذف المستخدم"
        message={`هل أنت متأكد من حذف المستخدم "${selectedUser?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        loading={crudLoading}
      />
    </MuiBox>
  )
}
