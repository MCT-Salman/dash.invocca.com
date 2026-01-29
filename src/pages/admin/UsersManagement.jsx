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

// Layout & Common Components
import { LoadingScreen, EmptyState, SEOHead, DataTable, ConfirmDialog, PageHeader, StatCard } from '@/components/common'
import ViewUserDialog from './components/ViewUserDialog'
import CreateAdminDialog from './components/CreateAdminDialog'

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
  const roleConfig = {
    [USER_ROLES.ADMIN]: { label: 'مدير نظام', color: 'error', icon: Shield },
    [USER_ROLES.MANAGER]: { label: 'مدير قاعة/صالة', color: 'secondary', icon: Users },
    [USER_ROLES.CLIENT]: { label: 'عميل', color: 'info', icon: User },
    [USER_ROLES.EMPLOYEE]: { label: 'موظف', color: 'success', icon: Users }
  }

  const config = roleConfig[role] || roleConfig[USER_ROLES.CLIENT]
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
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)
  const [roleFilter, setRoleFilter] = useState('all')

  // Dialog state management
  const {
    dialogOpen,
    dialogType,
    selectedItem: selectedUser,
    openCreateDialog,
    openViewDialog,
    openDeleteDialog,
    closeDialog,
    isCreate,
    isView,
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

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    return filtered
  }, [users, debouncedSearch, roleFilter])

  // Table Columns
  const columns = [
    {
      id: 'name',
      label: 'المستخدم',
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

  // Create Admin mutation
  const addAdminMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post('/admin/users/add', payload)
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

  if (isLoading) return <LoadingScreen message="جاري تحميل المستخدمين..." />

  return (
    <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
      <SEOHead title="إدارة المستخدمين | INVOCCA" />

      <PageHeader
        icon={Users}
        title={`إدارة المستخدمين (${filteredUsers.length})`}
        subtitle="إدارة جميع حسابات المستخدمين وصلاحياتهم في النظام"
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

      {/* Stats Cards */}
      <MuiGrid container spacing={3} sx={{ mb: 4 }}>
        <MuiGrid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي المستخدمين"
            value={users.length}
            icon={<Users size={24} />}
          />
        </MuiGrid>
        <MuiGrid item xs={12} sm={6} md={3}>
          <StatCard
            title="مدراء النظام"
            value={users.filter(u => u.role === USER_ROLES.ADMIN).length}
            icon={<Shield size={24} />}
            sx={{ borderTop: '4px solid var(--color-error-500)' }}
          />
        </MuiGrid>
        <MuiGrid item xs={12} sm={6} md={3}>
          <StatCard
            title="مدراء قاعات/صالات"
            value={users.filter(u => u.role === USER_ROLES.MANAGER).length}
            icon={<Users size={24} />}
            sx={{ borderTop: '4px solid var(--color-secondary-500)' }}
          />
        </MuiGrid>
        <MuiGrid item xs={12} sm={6} md={3}>
          <StatCard
            title="العملاء"
            value={users.filter(u => u.role === USER_ROLES.CLIENT).length}
            icon={<User size={24} />}
            sx={{ borderTop: '4px solid var(--color-info-500)' }}
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
              placeholder="البحث بالاسم، الهاتف، أو البريد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startIcon={<Search size={20} />}
            />
          </MuiGrid>
          <MuiGrid item xs={12} md={4}>
            <MuiSelect
              fullWidth
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              options={[
                { label: 'الكل', value: 'all' },
                { label: 'مدير نظام', value: USER_ROLES.ADMIN },
                { label: 'مدير قاعة/صالة', value: USER_ROLES.MANAGER },
                { label: 'عميل', value: USER_ROLES.CLIENT },
                { label: 'موظف', value: USER_ROLES.EMPLOYEE }
              ]}
            />
          </MuiGrid>
        </MuiGrid>
      </MuiPaper>

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
