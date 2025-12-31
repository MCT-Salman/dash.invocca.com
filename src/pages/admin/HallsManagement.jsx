// src\pages\admin\HallsManagement.jsx
import { useState, useMemo, useEffect, useRef } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMediaQuery, useTheme } from '@mui/material'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

// MUI Components
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiButton from '@/components/ui/MuiButton'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiCard from '@/components/ui/MuiCard'
import MuiCardContent from '@/components/ui/MuiCardContent'
import MuiCardActions from '@/components/ui/MuiCardActions'
import MuiDialog from '@/components/ui/MuiDialog'
import MuiDialogTitle from '@/components/ui/MuiDialogTitle'
import MuiDialogContent from '@/components/ui/MuiDialogContent'
import MuiDialogActions from '@/components/ui/MuiDialogActions'
import MuiDivider from '@/components/ui/MuiDivider'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiChip from '@/components/ui/MuiChip'
import MuiAlert from '@/components/ui/MuiAlert'
import MuiCircularProgress from '@/components/ui/MuiCircularProgress'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiSwitch from '@/components/ui/MuiSwitch'
import MuiAutocomplete from '@/components/ui/MuiAutocomplete'
import MuiAvatar from '@/components/ui/MuiAvatar'
import MuiInputAdornment from '@/components/ui/MuiInputAdornment'

// Layout & Common Components
import DashboardLayout from '@/components/layout/DashboardLayout'
import { LoadingScreen, EmptyState, ConfirmDialog, SEOHead, CardsView, TablePagination, DataTable } from '@/components/common'
import CreateEditHallDialog from './components/CreateEditHallDialog'
import ViewHallDialog from './components/ViewHallDialog'

// Hooks & Utilities
import { useNotification, useDebounce, useDialogState, useCRUD } from '@/hooks'
import { QUERY_KEYS } from '@/config/constants'
import { getAllHalls, createHall, updateHall, deleteHall, getServicesList } from '@/api/admin'
import { formatCurrency, formatPhoneNumber, generateExportFileName } from '@/utils/helpers'

// Icons
import {
  Building2,
  Search,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  Eye,
  Download,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  User,
  Phone,
  Users,
  DollarSign,
  MapPin,
  Table,
  Armchair as Chair,
  Check,
  X,
  FileText,
  Image as ImageIcon,
  Wifi,
  Car,
  Coffee,
  Music,
  Star,
  Upload,
  Settings,
  Shield,
  Calendar,
  Clock
} from 'lucide-react'

// Helper function for truncating text
const truncateText = (text, maxLength = 50) => {
  if (!text || typeof text !== 'string') return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// ====================== Validation Schema ======================
const createHallSchema = (editingHall = null) => z.object({
  name: z.string()
    .min(3, 'اسم القاعة يجب أن يكون 3 أحرف على الأقل')
    .max(100, 'اسم القاعة طويل جداً'),

  location: z.string()
    .min(3, 'الموقع مطلوب')
    .max(200, 'الموقع طويل جداً'),

  address: z.string()
    .min(5, 'العنوان التفصيلي مطلوب')
    .max(300, 'العنوان طويل جداً'),

  capacity: z.coerce.number()
    .min(1, 'السعة مطلوبة')
    .max(10000, 'السعة كبيرة جداً'),

  tables: z.coerce.number()
    .min(1, 'عدد الطاولات مطلوب')
    .max(1000, 'عدد الطاولات كبير جداً'),

  chairs: z.coerce.number()
    .min(1, 'عدد الكراسي مطلوب')
    .max(10000, 'عدد الكراسي كبير جداً'),

  maxEmployees: z.coerce.number()
    .min(1, 'الحد الأقصى للموظفين مطلوب')
    .max(1000, 'الحد الأقصى للموظفين كبير جداً'),

  defaultPrices: z.coerce.number()
    .min(0, 'السعر مطلوب')
    .max(1000000, 'السعر كبير جداً'),

  managerName: z.string()
    .min(3, 'اسم المدير مطلوب')
    .max(100, 'اسم المدير طويل جداً'),

  managerUsername: z.string()
    .min(3, 'اسم المستخدم مطلوب')
    .max(50, 'اسم المستخدم طويل جداً')
    .regex(/^[a-zA-Z0-9_]+$/, 'اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام و _ فقط'),

  managerPhone: z.string()
    .regex(/^\d+$/, 'رقم الهاتف يجب أن يكون أرقام فقط')
    .min(6, 'رقم الهاتف يجب أن يكون 6 أرقام على الأقل')
    .max(15, 'رقم الهاتف طويل جداً'),

  managerPassword: editingHall
    ? z.string()
      .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      .max(50, 'كلمة المرور طويلة جداً')
      .optional()
      .or(z.literal(''))
    : z.string()
      .min(6, 'كلمة المرور مطلوبة')
      .max(50, 'كلمة المرور طويلة جداً'),

  description: z.string()
    .max(1000, 'الوصف طويل جداً')
    .optional()
    .or(z.literal('')),

  amenities: z.array(z.string())
    .optional()
    .default([]),

  services: z.array(z.object({
    service: z.string(),
    customPrice: z.number().optional(),
    isIncluded: z.boolean().optional().default(false),
    notes: z.string().optional()
  }))
    .optional()
    .default([]),

  images: z.array(z.string())
    .optional()
    .default([]),

  primaryImage: z.string()
    .optional()
    .nullable(),

  isActive: z.boolean()
    .optional()
    .default(true)
})

// ====================== Main Component ======================
const HallsManagement = () => {
  // State Management
  const [halls, setHalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState('table') // 'table' or 'card'

  // Refs
  const fileInputRef = useRef(null)

  // Hooks
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { addNotification: showNotification } = useNotification()
  const debouncedSearch = useDebounce(searchTerm, 500)

  // Dialog state management
  const {
    dialogOpen,
    dialogType,
    selectedItem: selectedHall,
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
    createMutation,
    updateMutation,
    deleteMutation,
    handleCreate,
    handleUpdate,
    handleDelete,
    isLoading: crudLoading,
  } = useCRUD({
    createFn: createHall,
    updateFn: updateHall,
    deleteFn: deleteHall,
    queryKey: QUERY_KEYS.ADMIN_HALLS,
    successMessage: 'تمت العملية بنجاح',
    errorMessage: 'حدث خطأ أثناء العملية',
    onSuccess: () => {
      fetchHalls()
    },
  })

  // Fetch Halls Function
  const fetchHalls = async () => {
    try {
      setLoading(true)
      const response = await getAllHalls()


      // تحقق من بنية الاستجابة المختلفة
      let hallsData = []

      if (Array.isArray(response)) {
        hallsData = response
      } else if (response?.data) {
        if (Array.isArray(response.data)) {
          hallsData = response.data
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          hallsData = response.data.data
        } else if (response.data?.halls && Array.isArray(response.data.halls)) {
          hallsData = response.data.halls
        } else if (response.data?.hallsWithDetails && Array.isArray(response.data.hallsWithDetails)) {
          hallsData = response.data.hallsWithDetails
        }
      } else if (response?.halls && Array.isArray(response.halls)) {
        hallsData = response.halls
      } else if (response?.hallsWithDetails && Array.isArray(response.hallsWithDetails)) {
        hallsData = response.hallsWithDetails
      }

      setHalls(hallsData)
      setError(null)
    } catch (err) {
      setError('حدث خطأ في جلب بيانات القاعات')
      showNotification({
        title: 'خطأ',
        message: 'فشل في تحميل بيانات القاعات',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  // Initial Data Fetch
  useEffect(() => {
    fetchHalls()
  }, [])

  // Filtered Halls
  const filteredHalls = useMemo(() => {
    let filtered = halls

    // Apply search filter (name, manager name, manager phone ONLY)
    if (debouncedSearch) {
      filtered = filtered.filter(hall =>
        hall.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (hall.managerName || hall.generalManager?.name)?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (hall.managerPhone || hall.generalManager?.phone)?.includes(debouncedSearch)
      )
    }

    // Apply location filter
    if (locationFilter && locationFilter !== 'all') {
      filtered = filtered.filter(hall => hall.location === locationFilter)
    }

    // Apply status filter
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(hall => {
        if (statusFilter === 'active') return hall.isActive === true
        if (statusFilter === 'inactive') return hall.isActive === false
        return true
      })
    }

    return filtered
  }, [halls, debouncedSearch, locationFilter, statusFilter])

  // Get unique locations for filter dropdown
  const uniqueLocations = useMemo(() => {
    const locations = halls.map(hall => hall.location).filter(Boolean)
    return [...new Set(locations)]
  }, [halls])

  // Table Columns Definition
  const columns = [
    {
      id: 'name',
      label: 'اسم القاعة',
      align: 'right',
      format: (value, row) => (
        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {row.primaryImage || row.images?.[0] ? (
            <MuiAvatar
              src={row.primaryImage || row.images[0]}
              alt={value}
              sx={{ width: 40, height: 40, border: '1px solid var(--color-border-glass)' }}
            />
          ) : (
            <MuiBox
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: 'rgba(216, 185, 138, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(216, 185, 138, 0.4)',
              }}
            >
              <Building2 size={20} style={{ color: '#D8B98A' }} />
            </MuiBox>
          )}
          <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 500 }}>
            {value}
          </MuiTypography>
        </MuiBox>
      )
    },
    {
      id: 'capacity',
      label: 'السعة',
      align: 'center',
      format: (value) => (
        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
          <Users size={16} style={{ color: '#0284c7' }} />
          <span style={{ color: 'var(--color-text-secondary)' }}>{value} شخص</span>
        </MuiBox>
      )
    },
    {
      id: 'location',
      label: 'الموقع',
      align: 'right',
      format: (value) => (
        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MapPin size={16} style={{ color: '#9333ea' }} />
          <span style={{ color: 'var(--color-text-secondary)' }}>{truncateText(value, 30)}</span>
        </MuiBox>
      )
    },
    {
      id: 'defaultPrices',
      label: 'السعر الافتراضي',
      align: 'center',
      format: (value) => (
        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
          <DollarSign size={16} style={{ color: '#16a34a' }} />
          <span style={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>{formatCurrency(value) || `${value} ل.س`}</span>
        </MuiBox>
      )
    },
    {
      id: 'generalManager',
      label: 'اسم المدير',
      align: 'right',
      format: (value, row) => {
        const name = value?.name || row.managerName || '—'
        const phone = value?.phone || row.managerPhone

        return (
          <MuiBox>
            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 500 }}>
              {name}
            </MuiTypography>
            {phone && (
              <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                {formatPhoneNumber(phone) || phone}
              </MuiTypography>
            )}
          </MuiBox>
        )
      }
    },
    {
      id: 'isActive',
      label: 'الحالة',
      align: 'center',
      format: (value) => (
        <MuiChip
          label={value ? 'نشطة' : 'غير نشطة'}
          size="small"
          sx={{
            backgroundColor: value ? 'rgba(22, 163, 74, 0.2)' : 'rgba(220, 38, 38, 0.2)',
            color: value ? '#16a34a' : '#dc2626',
            fontWeight: 600,
            border: 'none',
          }}
          icon={value ? <CheckCircle size={14} /> : <XCircle size={14} />}
        />
      )
    }
  ]

  // Event Handlers

  const handleToggleStatus = async (row) => {
    try {
      const updatedHall = { ...row, isActive: !row.isActive }
      await updateHall(row.id, updatedHall)

      // Update local state
      setHalls(halls.map(hall =>
        hall.id === row.id ? updatedHall : hall
      ))

      showNotification({
        title: 'تم التحديث',
        message: `تم ${updatedHall.isActive ? 'تفعيل' : 'إلغاء تفعيل'} القاعة بنجاح`,
        type: 'success'
      })
    } catch (err) {
      showNotification({
        title: 'خطأ',
        message: 'فشل في تحديث حالة القاعة',
        type: 'error'
      })
    }
  }

  const handleCreateClick = () => {
    openCreateDialog()
  }

  const handleEditClick = (row) => {
    openEditDialog(row)
  }

  const handleRefresh = () => {
    fetchHalls()
  }

  const handleCreateSubmit = async (formData) => {
    await handleCreate(formData)
    closeDialog()
  }

  const handleUpdateSubmit = async (formData) => {
    const id = selectedHall?.id || selectedHall?._id
    if (!id) return
    await handleUpdate(id, formData)
    closeDialog()
  }

  const handleDeleteConfirm = async () => {
    const id = selectedHall?.id || selectedHall?._id
    if (!id) return
    await handleDelete(id)
    closeDialog()
  }

  const handleExport = () => {
    try {
      const exportData = halls.map(hall => ({
        'اسم القاعة': hall.name,
        'الموقع': hall.location,
        'السعة': hall.capacity,
        'السعر الافتراضي': hall.defaultPrices,
        'اسم المدير': hall.managerName,
        'هاتف المدير': hall.managerPhone,
        'الحالة': hall.isActive ? 'نشطة' : 'غير نشطة',
        'الوصف': hall.description || '',
        'العنوان': hall.address || '',
        'عدد الطاولات': hall.tables || 0,
        'عدد الكراسي': hall.chairs || 0
      }))

      const worksheet = XLSX.utils.json_to_sheet(exportData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'القاعات')

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

      saveAs(data, generateExportFileName('halls'))

      showNotification({
        title: 'تم التصدير',
        message: 'تم تصدير بيانات القاعات بنجاح',
        type: 'success'
      })
    } catch (err) {
      showNotification({
        title: 'خطأ',
        message: 'فشل في تصدير البيانات',
        type: 'error'
      })
    }
  }

  // Render Loading State
  if (loading && halls.length === 0) {
    return <LoadingScreen message="جاري تحميل بيانات القاعات..." />
  }

  // Render Error State
  if (error && halls.length === 0) {
    return (
      <EmptyState
        title="حدث خطأ"
        description={error}
        icon={AlertCircle}
        action={
          <MuiButton
            variant="contained"
            color="primary"
            startIcon={<RefreshCw />}
            onClick={handleRefresh}
          >
            إعادة المحاولة
          </MuiButton>
        }
        showPaper
      />
    )
  }

  return (
    <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
      <SEOHead pageKey="hallsManagement" title="إدارة القاعات | INVOCCA" />

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
        <MuiBox sx={{ position: 'relative', zIndex: 1 }}>
          <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
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
              <Building2 size={28} className="text-white" />
            </MuiBox>
            <MuiBox>
              <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700, mb: 0.5 }}>
                إدارة الصالات ({filteredHalls.length})
              </MuiTypography>
              <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                إدارة جميع صالات المناسبات في النظام
              </MuiTypography>
            </MuiBox>
          </MuiBox>
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
                  {halls.length}
                </MuiTypography>
                <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                  عدد القاعات
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
                <Building2 size={28} style={{ color: '#D8B98A' }} />
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
              border: '1px solid rgba(22, 163, 74, 0.2)',
              borderRadius: '16px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                borderColor: '#16a34a',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #16a34a, transparent)',
              }
            }}
          >
            <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <MuiBox>
                <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                  {halls.filter(h => h.isActive).length}
                </MuiTypography>
                <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                  القاعات النشطة
                </MuiTypography>
              </MuiBox>
              <MuiBox
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '12px',
                  background: 'rgba(22, 163, 74, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(22, 163, 74, 0.2)',
                }}
              >
                <CheckCircle size={28} style={{ color: '#16a34a' }} />
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
                  {halls.reduce((sum, hall) => sum + (hall.capacity || 0), 0)}
                </MuiTypography>
                <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                  إجمالي السعة
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
                <Users size={28} style={{ color: '#0284c7' }} />
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
              border: '1px solid rgba(217, 155, 61, 0.2)',
              borderRadius: '16px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                borderColor: 'var(--color-warning-500)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, var(--color-warning-500), transparent)',
              }
            }}
          >
            <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <MuiBox>
                <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                  {halls.length > 0
                    ? Math.round(halls.reduce((sum, hall) => sum + (hall.defaultPrices || 0), 0) / halls.length)
                    : 0
                  }
                </MuiTypography>
                <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                  متوسط السعر
                </MuiTypography>
              </MuiBox>
              <MuiBox
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '12px',
                  background: 'rgba(217, 155, 61, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(217, 155, 61, 0.2)',
                }}
              >
                <DollarSign size={28} style={{ color: '#D99B3D' }} />
              </MuiBox>
            </MuiBox>
          </MuiPaper>
        </MuiGrid>
      </MuiGrid>

      {/* Search and Filter */}
      <MuiPaper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '16px',
          border: '1px solid var(--color-border-glass)',
          background: 'var(--color-surface-dark)',
          mb: 4
        }}
      >
        <MuiGrid container spacing={2}>
          <MuiGrid item xs={12} md={6}>
            <MuiTextField
              fullWidth
              placeholder="ابحث (اسم القاعة، المدير، رقم الهاتف)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <MuiInputAdornment position="start">
                    <Search size={20} className="text-text-secondary" />
                  </MuiInputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.3)',
                  }
                }
              }}
            />
          </MuiGrid>
          <MuiGrid item xs={12} md={3}>
            <MuiSelect
              fullWidth
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              sx={{
                borderRadius: '10px',
              }}
            >
              <MuiMenuItem value="all">جميع المواقع</MuiMenuItem>
              {uniqueLocations.map((location) => {
                const locationValue = typeof location === 'object' ? location.value || location.id || location : location
                const locationLabel = typeof location === 'object' ? location.label || location.name || location : location
                return (
                  <MuiMenuItem key={locationValue} value={locationValue}>
                    {locationLabel}
                  </MuiMenuItem>
                )
              })}
            </MuiSelect>
          </MuiGrid>
          <MuiGrid item xs={12} md={3}>
            <MuiSelect
              fullWidth
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{
                borderRadius: '10px',
              }}
            >
              <MuiMenuItem value="all">جميع الحالات</MuiMenuItem>
              <MuiMenuItem value="active">نشطة</MuiMenuItem>
              <MuiMenuItem value="inactive">غير نشطة</MuiMenuItem>
            </MuiSelect>
          </MuiGrid>
        </MuiGrid>
        <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <MuiBox sx={{ display: 'flex', gap: 2 }}>
            {(locationFilter !== 'all' || statusFilter !== 'all' || searchTerm) && (
              <MuiButton
                variant="outlined"
                size="small"
                onClick={() => {
                  setLocationFilter('all')
                  setStatusFilter('all')
                  setSearchTerm('')
                }}
                startIcon={<X size={16} />}
                sx={{
                  borderColor: 'var(--color-text-secondary)',
                  color: 'var(--color-text-secondary)',
                  '&:hover': {
                    borderColor: '#666',
                    background: 'rgba(136, 136, 136, 0.1)',
                  }
                }}
              >
                مسح الفلاتر
              </MuiButton>
            )}
          </MuiBox>
          <MuiBox sx={{ display: 'flex', gap: 2 }}>
            <MuiButton
              variant="outlined"
              color="info"
              startIcon={<Download size={20} />}
              onClick={handleExport}
              disabled={halls.length === 0}
            >
              تصدير
            </MuiButton>
            <MuiButton
              variant="contained"
              startIcon={<Plus size={20} />}
              onClick={handleCreateClick}
              color="primary"
            >
              إضافة قاعة
            </MuiButton>
          </MuiBox>
        </MuiBox>
      </MuiPaper>

      {/* Content */}
      <DataTable
        columns={columns}
        rows={filteredHalls}
        onEdit={handleEditClick}
        onDelete={openDeleteDialog}
        onView={openViewDialog}
        onToggleStatus={handleToggleStatus}
        loading={loading}
        emptyMessage="لا توجد قاعات متاحة"
        showActions={true}
      />

      {/* Dialogs */}
      <CreateEditHallDialog
        key={selectedHall?.id || selectedHall?._id || 'new'}
        open={isCreate || isEdit}
        onClose={closeDialog}
        onSubmit={isCreate ? handleCreateSubmit : handleUpdateSubmit}
        editingHall={isEdit ? selectedHall : null}
        loading={crudLoading}
      />

      <ViewHallDialog
        open={isView}
        onClose={closeDialog}
        hall={selectedHall}
      />

      <ConfirmDialog
        open={isDelete}
        onClose={closeDialog}
        onConfirm={handleDeleteConfirm}
        title="حذف القاعة"
        message={`هل أنت متأكد من حذف القاعة "${selectedHall?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        loading={crudLoading}
      />
    </MuiBox>
  )
}

export default HallsManagement