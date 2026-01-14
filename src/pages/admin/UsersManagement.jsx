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
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiSelect from '@/components/ui/MuiSelect'

// Layout & Common Components
import { LoadingScreen, EmptyState, SEOHead, DataTable, ConfirmDialog } from '@/components/common'
import ViewUserDialog from './components/ViewUserDialog'

// Hooks & Utilities
import { useDebounce, useDialogState, useCRUD, useNotification } from '@/hooks'
import { QUERY_KEYS, USER_ROLES } from '@/config/constants'
import { getUsers, deleteUser, toggleUserStatus } from '@/api/admin'

// Icons
import {
  Users,
  Search,
  Trash2,
  X,
  Shield,
  User,
  Phone,
  RefreshCw,
  CheckCircle,
  XCircle
} from 'lucide-react'

// ====================== Roles Badge ======================
const UserRoleBadge = ({ role }) => {
  const roleConfig = {
    [USER_ROLES.ADMIN]: { label: 'مدير نظام', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)', icon: Shield },
    [USER_ROLES.MANAGER]: { label: 'مدير قاعة/صالة', color: '#9333ea', bg: 'rgba(147, 51, 234, 0.1)', icon: Users },
    [USER_ROLES.CLIENT]: { label: 'عميل', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.1)', icon: User },
    [USER_ROLES.EMPLOYEE]: { label: 'موظف', color: '#16a34a', bg: 'rgba(22, 163, 74, 0.1)', icon: Users }
  }

  const config = roleConfig[role] || roleConfig[USER_ROLES.CLIENT]
  const Icon = config.icon

  return (
    <MuiChip
      icon={<Icon size={14} />}
      label={config.label}
      size="small"
      sx={{
        background: config.bg,
        color: config.color,
        fontWeight: 600,
        border: `1px solid ${config.color}33`,
        '& .MuiChip-icon': { color: config.color }
      }}
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
    openViewDialog,
    openDeleteDialog,
    closeDialog,
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
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.875rem'
            }}
          >
            {value?.charAt(0).toUpperCase() || 'U'}
          </MuiAvatar>
          <MuiBox>
            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
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
          <Phone size={14} style={{ color: 'var(--color-primary-400)' }} />
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
          sx={{
            backgroundColor: value ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)',
            color: value ? '#16a34a' : '#dc2626',
            fontWeight: 600,
            border: `1px solid ${value ? '#16a34a' : '#dc2626'}33`,
          }}
          icon={value ? <CheckCircle size={14} /> : <XCircle size={14} />}
        />
      )
    }
  ]

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

  const handleRefresh = () => {
    refetch()
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

      {/* Header Section */}
      <MuiBox
        sx={{
          mb: 4,
          p: 4,
          borderRadius: '20px',
          background: 'var(--color-surface-dark)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid var(--color-border-glass)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(216, 185, 138, 0.05) 0%, transparent 70%)',
            borderRadius: '50%',
          }
        }}
      >
        <MuiBox sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MuiBox
              sx={{
                width: 56,
                height: 56,
                borderRadius: '14px',
                background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--color-primary-500)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              <Users size={28} className="text-white" />
            </MuiBox>
            <MuiBox>
              <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700, mb: 0.5 }}>
                إدارة المستخدمين ({filteredUsers.length})
              </MuiTypography>
              <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                إدارة جميع حسابات المستخدمين وصلاحياتهم في النظام
              </MuiTypography>
            </MuiBox>
          </MuiBox>

          <MuiButton
            variant="outlined"
            startIcon={<RefreshCw size={20} />}
            onClick={handleRefresh}
            sx={{
              height: '56px',
              borderRadius: '12px',
              borderColor: 'var(--color-border-glass)',
              color: 'var(--color-text-secondary)',
              '&:hover': {
                borderColor: 'var(--color-primary-500)',
                background: 'rgba(216, 185, 138, 0.05)'
              }
            }}
          >
            تحديث
          </MuiButton>
        </MuiBox>
      </MuiBox>

      {/* Stats Cards */}
      <MuiGrid container spacing={3} sx={{ mb: 4 }}>
        <MuiGrid item xs={12} sm={6} md={3}>
          <MuiPaper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              background: 'var(--color-surface-dark)',
              border: '1px solid var(--color-border-glass)',
              borderRadius: '16px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                borderColor: 'var(--color-primary-500)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, var(--color-primary-500), transparent)',
              }
            }}
          >
            <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <MuiBox>
                <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                  {users.length}
                </MuiTypography>
                <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                  إجمالي المستخدمين
                </MuiTypography>
              </MuiBox>
              <MuiBox
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '12px',
                  background: 'rgba(216, 185, 138, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(216, 185, 138, 0.2)',
                }}
              >
                <Users size={28} style={{ color: '#D8B98A' }} />
              </MuiBox>
            </MuiBox>
          </MuiPaper>
        </MuiGrid>

        <MuiGrid item xs={12} sm={6} md={3}>
          <MuiPaper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              background: 'var(--color-surface-dark)',
              border: '1px solid rgba(220, 38, 38, 0.2)',
              borderRadius: '16px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                borderColor: '#dc2626',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #dc2626, transparent)',
              }
            }}
          >
            <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <MuiBox>
                <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                  {users.filter(u => u.role === USER_ROLES.ADMIN).length}
                </MuiTypography>
                <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                  مدراء النظام
                </MuiTypography>
              </MuiBox>
              <MuiBox
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '12px',
                  background: 'rgba(220, 38, 38, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(220, 38, 38, 0.2)',
                }}
              >
                <Shield size={28} style={{ color: '#dc2626' }} />
              </MuiBox>
            </MuiBox>
          </MuiPaper>
        </MuiGrid>

        <MuiGrid item xs={12} sm={6} md={3}>
          <MuiPaper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              background: 'var(--color-surface-dark)',
              border: '1px solid rgba(147, 51, 234, 0.2)',
              borderRadius: '16px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                borderColor: '#9333ea',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #9333ea, transparent)',
              }
            }}
          >
            <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <MuiBox>
                <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                  {users.filter(u => u.role === USER_ROLES.MANAGER).length}
                </MuiTypography>
                <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                  مدراء قاعات/صالات
                </MuiTypography>
              </MuiBox>
              <MuiBox
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '12px',
                  background: 'rgba(147, 51, 234, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(147, 51, 234, 0.2)',
                }}
              >
                <Users size={28} style={{ color: '#9333ea' }} />
              </MuiBox>
            </MuiBox>
          </MuiPaper>
        </MuiGrid>

        <MuiGrid item xs={12} sm={6} md={3}>
          <MuiPaper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              background: 'var(--color-surface-dark)',
              border: '1px solid rgba(2, 132, 199, 0.2)',
              borderRadius: '16px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                borderColor: '#0284c7',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #0284c7, transparent)',
              }
            }}
          >
            <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <MuiBox>
                <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                  {users.filter(u => u.role === USER_ROLES.CLIENT).length}
                </MuiTypography>
                <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                  العملاء
                </MuiTypography>
              </MuiBox>
              <MuiBox
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '12px',
                  background: 'rgba(2, 132, 199, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(2, 132, 199, 0.2)',
                }}
              >
                <User size={28} style={{ color: '#0284c7' }} />
              </MuiBox>
            </MuiBox>
          </MuiPaper>
        </MuiGrid>
      </MuiGrid>

      {/* Search & Filter */}
      <MuiPaper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          background: 'rgba(26, 26, 26, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--color-border-glass)',
          borderRadius: '16px'
        }}
      >
        <MuiGrid container spacing={2} alignItems="center">
          <MuiGrid item xs={12} md={6}>
            <MuiTextField
              fullWidth
              placeholder="البحث بالاسم، الهاتف، أو البريد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <MuiInputAdornment position="start">
                    <Search size={20} style={{ color: 'var(--color-primary-400)' }} />
                  </MuiInputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }
              }}
            />
          </MuiGrid>
          <MuiGrid item xs={12} md={4}>
            <MuiSelect
              fullWidth
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              sx={{
                borderRadius: '10px',
              }}
            >
              <MuiMenuItem value="all">الكل</MuiMenuItem>
              <MuiMenuItem value={USER_ROLES.ADMIN}>مدير نظام</MuiMenuItem>
              <MuiMenuItem value={USER_ROLES.MANAGER}>مدير قاعة/صالة</MuiMenuItem>
              <MuiMenuItem value={USER_ROLES.CLIENT}>عميل</MuiMenuItem>
              <MuiMenuItem value={USER_ROLES.EMPLOYEE}>موظف</MuiMenuItem>
            </MuiSelect>
          </MuiGrid>
          <MuiGrid item xs={12} md={2}>
            <MuiButton
              fullWidth
              variant="outlined"
              startIcon={<RefreshCw size={20} />}
              onClick={handleRefresh}
              sx={{
                height: '56px',
                borderRadius: '12px',
                borderColor: 'var(--color-border-glass)',
                color: 'var(--color-text-secondary)',
                '&:hover': {
                  borderColor: 'var(--color-primary-500)',
                  background: 'rgba(216, 185, 138, 0.05)'
                }
              }}
            >
              تحديث
            </MuiButton>
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
          showActions={true}
          sx={{
            background: 'rgba(26, 26, 26, 0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '1px solid var(--color-border-glass)',
            overflow: 'hidden',
          }}
        />
      )}

      {/* User View Dialog */}
      <ViewUserDialog
        open={isView}
        onClose={closeDialog}
        user={selectedUser}
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
