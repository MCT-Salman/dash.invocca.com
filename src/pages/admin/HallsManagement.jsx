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
import MuiIconButton from '@/components/ui/MuiIconButton'

// Layout & Common Components
import DashboardLayout from '@/components/layout/DashboardLayout'
import { LoadingScreen, EmptyState, ConfirmDialog, SEOHead, CardsView, TablePagination, DataTable, PageHeader, StatCard } from '@/components/common'
import CreateEditHallDialog from './components/CreateEditHallDialog'
import ViewHallDialog from './components/ViewHallDialog'

// Hooks & Utilities
import { useNotification, useDebounce, useDialogState, useCRUD } from '@/hooks'
import { QUERY_KEYS, API_CONFIG } from '@/config/constants'
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
  LayoutGrid,
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
  Clock,
  MoreVertical
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
    .min(3, 'اسم قاعة/صالة يجب أن يكون 3 أحرف على الأقل')
    .max(100, 'اسم قاعة/صالة طويل جداً'),

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
      setError('حدث خطأ في جلب بيانات قاعات/صالات')
      showNotification({
        title: 'خطأ',
        message: 'فشل في تحميل بيانات قاعات/صالات',
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
      label: 'اسم قاعة/صالة',
      align: 'right',
      format: (value, row) => {
        const imageUrl = row.primaryImage || row.images?.[0]
        const getFullImageUrl = (img) => {
          if (!img) return null
          if (typeof img === 'string') {
            if (img.startsWith('http')) return img
            return `${API_CONFIG.BASE_URL}${img.startsWith('/') ? '' : '/'}${img}`
          }
          if (img.url) {
            if (img.url.startsWith('http')) return img.url
            return `${API_CONFIG.BASE_URL}${img.url.startsWith('/') ? '' : '/'}${img.url}`
          }
          return null
        }
        const fullImageUrl = getFullImageUrl(imageUrl)

        return (
          <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {imageUrl ? (
              <MuiAvatar
                src={imageUrl}
                alt={value}
                onClick={() => {
                  if (fullImageUrl) window.open(fullImageUrl, '_blank')
                }}
                sx={{
                  width: 40,
                  height: 40,
                  border: '1px solid var(--color-border-glass)',
                  cursor: fullImageUrl ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  '&:hover': fullImageUrl ? {
                    opacity: 0.8,
                    transform: 'scale(1.1)',
                  } : {}
                }}
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
      }
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
        const username = value?.username
        const phone = value?.phone || row.managerPhone

        return (
          <MuiBox>
            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 500 }}>
              {name}
            </MuiTypography>
            {username && (
              <MuiTypography variant="caption" sx={{ color: 'var(--color-primary-500)', fontWeight: 500, display: 'block' }}>
                @{username}
              </MuiTypography>
            )}
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
          color={value ? 'success' : 'error'}
          variant="filled"
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
        message: `تم ${updatedHall.isActive ? 'تفعيل' : 'إلغاء تفعيل'} قاعة/صالة بنجاح`,
        type: 'success'
      })
    } catch (err) {
      showNotification({
        title: 'خطأ',
        message: 'فشل في تحديث حالة قاعة/صالة',
        type: 'error'
      })
    }
  }

  const handleExport = () => {
    try {
      const dataToExport = filteredHalls.map(hall => ({
        'اسم القاعة': hall.name,
        'الموقع': hall.location,
        'العنوان': hall.address,
        'السعة': hall.capacity,
        'عدد الطاولات': hall.tables,
        'عدد الكراسي': hall.chairs,
        'السعر الافتراضي': hall.defaultPrices,
        'المدير': hall.managerName || hall.generalManager?.name || '-',
        'رقم الهاتف': hall.managerPhone || hall.generalManager?.phone || '-',
        'الحالة': hall.isActive ? 'نشطة' : 'غير نشطة',
        'تاريخ الإنشاء': new Date(hall.createdAt).toLocaleDateString('ar-EG')
      }))

      const ws = XLSX.utils.json_to_sheet(dataToExport)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Halls')
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' })

      saveAs(data, generateExportFileName('halls'))

      showNotification({
        title: 'تم التصدير',
        message: 'تم تصدير بيانات القاعات بنجاح',
        type: 'success'
      })
    } catch (err) {
      showNotification({
        title: 'خطأ',
        message: 'حدث خطأ أثناء تصدير البيانات',
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

  const renderHallCard = (hall) => {
    const imageUrl = hall.primaryImage || hall.images?.[0]
    return (
      <MuiCard
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '20px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: 'var(--shadow-xl)',
            borderColor: 'var(--color-primary-500)',
          }
        }}
      >
        <MuiBox sx={{ position: 'relative', height: 180 }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={hall.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <MuiBox sx={{
              width: '100%',
              height: '100%',
              background: 'var(--color-primary-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Building2 size={48} style={{ color: 'var(--color-primary-300)' }} />
            </MuiBox>
          )}
          <MuiChip
            label={hall.isActive ? 'نشطة' : 'غير نشطة'}
            size="small"
            color={hall.isActive ? 'success' : 'error'}
            sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 700 }}
          />
        </MuiBox>

        <MuiCardContent sx={{ flexGrow: 1, p: 2.5 }}>
          <MuiTypography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'var(--color-text-primary)' }}>
            {hall.name}
          </MuiTypography>

          <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <MapPin size={14} style={{ color: 'var(--color-primary-500)' }} />
            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
              {hall.location}
            </MuiTypography>
          </MuiBox>

          <MuiGrid container spacing={1} sx={{ mt: 1 }}>
            <MuiGrid item xs={6}>
              <MuiBox sx={{ p: 1, borderRadius: '12px', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Users size={14} style={{ color: 'var(--color-info-500)' }} />
                <MuiTypography variant="caption" sx={{ fontWeight: 600 }}>{hall.capacity}</MuiTypography>
              </MuiBox>
            </MuiGrid>
            <MuiGrid item xs={6}>
              <MuiBox sx={{ p: 1, borderRadius: '12px', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', gap: 1 }}>
                <DollarSign size={14} style={{ color: 'var(--color-success-500)' }} />
                <MuiTypography variant="caption" sx={{ fontWeight: 600 }}>{formatCurrency(hall.defaultPrices)}</MuiTypography>
              </MuiBox>
            </MuiGrid>
          </MuiGrid>
        </MuiCardContent>

        <MuiCardActions sx={{ px: 2, py: 1.5, borderTop: '1px solid var(--color-divider)', justifyContent: 'space-between' }}>
          <MuiBox sx={{ display: 'flex', gap: 1 }}>
            <MuiIconButton size="small" onClick={() => openViewDialog(hall)} color="primary">
              <Eye size={18} />
            </MuiIconButton>
            <MuiIconButton size="small" onClick={() => handleEditClick(hall)} color="info">
              <Pencil size={18} />
            </MuiIconButton>
            <MuiIconButton size="small" onClick={() => openDeleteDialog(hall)} color="error">
              <Trash2 size={18} />
            </MuiIconButton>
          </MuiBox>
          <MuiSwitch
            checked={hall.isActive}
            onChange={() => handleToggleStatus(hall)}
            size="small"
          />
        </MuiCardActions>
      </MuiCard>
    )
  }

  // Render Loading State
  if (loading && halls.length === 0) {
    return <LoadingScreen message="جاري تحميل بيانات قاعات/صالات..." />
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
      <SEOHead pageKey="hallsManagement" title="إدارة قاعة/صالة | INVOCCA" />

      <PageHeader
        icon={Building2}
        title={`إدارة قاعة/صالة (${filteredHalls.length})`}
        subtitle="إدارة جميع قاعات/صالات المناسبات في النظام"
        actions={
          <MuiBox sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <MuiBox sx={{ display: 'flex', background: 'var(--color-surface)', p: 0.5, borderRadius: '12px', border: '1px solid var(--color-border)' }}>
              <MuiIconButton
                size="small"
                onClick={() => setViewMode('table')}
                sx={{
                  borderRadius: '10px',
                  color: viewMode === 'table' ? 'var(--color-primary-500)' : 'var(--color-text-muted)',
                  background: viewMode === 'table' ? 'var(--color-paper)' : 'transparent',
                  boxShadow: viewMode === 'table' ? 'var(--shadow-sm)' : 'none',
                  '&:hover': { background: viewMode === 'table' ? 'var(--color-paper)' : 'rgba(0,0,0,0.05)' }
                }}
              >
                <Table size={20} />
              </MuiIconButton>
              <MuiIconButton
                size="small"
                onClick={() => setViewMode('card')}
                sx={{
                  borderRadius: '10px',
                  color: viewMode === 'card' ? 'var(--color-primary-500)' : 'var(--color-text-muted)',
                  background: viewMode === 'card' ? 'var(--color-paper)' : 'transparent',
                  boxShadow: viewMode === 'card' ? 'var(--shadow-sm)' : 'none',
                  '&:hover': { background: viewMode === 'card' ? 'var(--color-paper)' : 'rgba(0,0,0,0.05)' }
                }}
              >
                <LayoutGrid size={20} />
              </MuiIconButton>
            </MuiBox>
            <MuiButton
              variant="outlined"
              start_icon={<Download size={18} />}
              onClick={handleExport}
            >
              تصدير
            </MuiButton>
            <MuiButton
              variant="contained"
              start_icon={<Plus size={18} />}
              onClick={handleCreateClick}
            >
              إضافة
            </MuiButton>
          </MuiBox>
        }
      />

      {/* Stats Cards */}
      <MuiGrid container spacing={3} sx={{ mb: 4 }}>
        <MuiGrid item xs={12} sm={6} md={3}>
          <StatCard
            title="عدد قاعات/صالات"
            value={halls.length}
            icon={<Building2 size={24} />}
          />
        </MuiGrid>
        <MuiGrid item xs={12} sm={6} md={3}>
          <StatCard
            title="قاعات/صالات النشطة"
            value={halls.filter(h => h.isActive).length}
            icon={<CheckCircle size={24} />}
            sx={{ borderTop: '4px solid var(--color-success-500)' }}
          />
        </MuiGrid>
        <MuiGrid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي السعة"
            value={halls.reduce((sum, hall) => sum + (hall.capacity || 0), 0)}
            icon={<Users size={24} />}
            sx={{ borderTop: '4px solid var(--color-info-500)' }}
          />
        </MuiGrid>
        <MuiGrid item xs={12} sm={6} md={3}>
          <StatCard
            title="متوسط السعر"
            value={formatCurrency(halls.length > 0 ? halls.reduce((sum, h) => sum + (h.defaultPrices || 0), 0) / halls.length : 0)}
            icon={<DollarSign size={24} />}
            sx={{ borderTop: '4px solid var(--color-primary-500)' }}
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
          <MuiGrid item xs={12} md={6}>
            <MuiTextField
              fullWidth
              placeholder="ابحث (اسم قاعة/صالة، المدير، رقم الهاتف)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startIcon={<Search size={20} />}
            />
          </MuiGrid>
          <MuiGrid item xs={12} md={3}>
            <MuiSelect
              fullWidth
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              options={[
                { label: 'جميع المواقع', value: 'all' },
                ...uniqueLocations.map(loc => ({ label: loc, value: loc }))
              ]}
            />
          </MuiGrid>
          <MuiGrid item xs={12} md={3}>
            <MuiSelect
              fullWidth
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { label: 'جميع الحالات', value: 'all' },
                { label: 'نشطة', value: 'active' },
                { label: 'غير نشطة', value: 'inactive' }
              ]}
            />
          </MuiGrid>
        </MuiGrid>
      </MuiPaper>

      {/* Content */}
      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={filteredHalls}
          onEdit={handleEditClick}
          onDelete={openDeleteDialog}
          onView={openViewDialog}
          onToggleStatus={handleToggleStatus}
          loading={loading}
          emptyMessage="لا توجد قاعات/صالات متاحة"
        />
      ) : (
        <CardsView
          data={filteredHalls}
          renderCard={renderHallCard}
          loading={loading}
          emptyMessage="لا توجد قاعات/صالات متاحة"
        />
      )}

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
        title="حذف قاعة/صالة"
        message={`هل أنت متأكد من حذف قاعة/صالة "${selectedHall?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        loading={crudLoading}
      />
    </MuiBox>
  )
}

export default HallsManagement