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

import MuiAlert from '@/components/ui/MuiAlert'

import MuiCircularProgress from '@/components/ui/MuiCircularProgress'

import MuiSelect from '@/components/ui/MuiSelect'

import MuiMenuItem from '@/components/ui/MuiMenuItem'

import MuiSwitch from '@/components/ui/MuiSwitch'

import MuiAutocomplete from '@/components/ui/MuiAutocomplete'

import MuiAvatar from '@/components/ui/MuiAvatar'

import MuiInputAdornment from '@/components/ui/MuiInputAdornment'

import MuiIconButton from '@/components/ui/MuiIconButton'

import { StatusBadge } from '@/components/common'

// Layout & Common Components

import DashboardLayout from '@/components/layout/DashboardLayout'

import { LoadingScreen, EmptyState, ConfirmDialog, SEOHead, CrudPageLayout } from '@/components/common'

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

  const [searchQuery, setSearchQuery] = useState('')

  const [activeFilters, setActiveFilters] = useState({})

  const [viewMode, setViewMode] = useState('table') // 'table' or 'card'

  const [submitError, setSubmitError] = useState(null)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const debouncedSearch = useDebounce(searchQuery, 500)



  // Refs

  const fileInputRef = useRef(null)



  // Hooks

  const theme = useTheme()

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { addNotification: showNotification } = useNotification()

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

      setSubmitError(null)

      closeDialog()

    },

    onError: (error) => {

      // احفظ الـ error لعرضه في الـ Dialog

      const errorMsg = error?.response?.data?.error ||

        error?.response?.data?.message ||

        error?.message ||

        'حدث خطأ أثناء العملية'

      setSubmitError(errorMsg)

      // لا تغلق الـ Dialog - سيبقى مفتوحاً

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



    // Apply location filter from activeFilters

    if (activeFilters.location && activeFilters.location !== 'all') {

      filtered = filtered.filter(hall => hall.location === activeFilters.location)

    }



    // Apply status filter from activeFilters

    if (activeFilters.status && activeFilters.status !== 'all') {

      filtered = filtered.filter(hall => {

        if (activeFilters.status === 'active') return hall.isActive === true

        if (activeFilters.status === 'inactive') return hall.isActive === false

        return true

      })

    }



    // Apply date range filter

    if (activeFilters.dateFrom || activeFilters.dateTo) {

      filtered = filtered.filter(hall => {

        if (!hall.createdAt) return false

        const hallDate = new Date(hall.createdAt)

        const fromDate = activeFilters.dateFrom ? new Date(activeFilters.dateFrom) : null

        const toDate = activeFilters.dateTo ? new Date(activeFilters.dateTo) : null

        // Set toDate to end of day to include the selected date
        if (toDate) {
          toDate.setHours(23, 59, 59, 999)
        }

        if (fromDate && hallDate < fromDate) return false

        if (toDate && hallDate > toDate) return false



        return true

      })

    }



    return filtered

  }, [halls, debouncedSearch, activeFilters])



  // Get unique locations for filter dropdown

  const uniqueLocations = useMemo(() => {

    const locations = halls.map(hall => hall.location).filter(Boolean)

    return [...new Set(locations)]

  }, [halls])



  // Filter configuration for AdvancedFilter

  const filterConfig = useMemo(() => {

    const locationOptions = uniqueLocations.map(loc => ({ value: loc, label: loc }))

    return [

      {

        key: 'location',

        label: 'الموقع',

        type: 'select',

        options: locationOptions

      },

      {

        key: 'status',

        label: 'الحالة',

        type: 'select',

        options: [

          { value: 'active', label: 'نشطة' },

          { value: 'inactive', label: 'غير نشطة' }

        ]

      },

      {

        key: 'createdAt',

        label: 'تاريخ الإنشاء',

        type: 'dateRange'

      }

    ]

  }, [uniqueLocations])



  // Table Columns Definition

  const columns = [

    {

      id: 'name',

      label: 'اسم قاعة/صالة',

      align: 'right',

      // minWidth: 60,

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

            {/* {imageUrl ? (

              <MuiAvatar

                src={imageUrl}

                alt={value}

                onClick={() => {

                  if (fullImageUrl) window.open(fullImageUrl, '_blank')

                }}

                sx={{

                  width: 20,

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

                  background: 'color-mix(in srgb, var(--color-gold) 20%, transparent)',

                  display: 'flex',

                  alignItems: 'center',

                  justifyContent: 'center',

                  border: '1px solid var(--color-border)',

                }}

              >

                <Building2 size={20} style={{ color: 'var(--color-icon)' }} />

              </MuiBox>

            )} */}

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

      // minWidth: 10,

      format: (value) => (

        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-start' }}>

          <Users size={16} style={{ color: 'var(--color-icon)' }} />

          <span style={{ color: 'var(--color-text-secondary)' }}>{value} شخص</span>

        </MuiBox>

      )

    },

    {

      id: 'location',

      label: 'الموقع',

      align: 'right',
      // minWidth: 40,

      format: (value) => (

        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

          <MapPin size={16} style={{ color: 'var(--color-icon)' }} />

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

          <DollarSign size={16} style={{ color: 'var(--color-icon)' }} />

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

              <MuiTypography variant="caption" sx={{ color: 'var(--color-icon)', fontWeight: 500, display: 'block' }}>

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

      id: 'createdAt',

      label: 'تاريخ الإنشاء',

      align: 'center',

      format: (value) => {

        if (!value) return '—'

        const date = new Date(value)

        return (

          <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>

            <Calendar size={16} style={{ color: 'var(--color-icon)' }} />

            <span style={{ color: 'var(--color-text-secondary)' }}>

              {date.toLocaleDateString('en-US', {

                year: 'numeric',

                month: 'short',

                day: 'numeric'

              })}

            </span>

          </MuiBox>

        )

      }

    },

    {

      id: 'isActive',

      label: 'الحالة',

      align: 'center',

      format: (value) => (

        <StatusBadge value={value} activeLabel="نشطة" inactiveLabel="غير نشطة" />

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

    setSubmitError(null)

    await handleCreate(formData)

    // closeDialog()

  }



  const handleUpdateSubmit = async (formData) => {

    const id = selectedHall?.id || selectedHall?._id

    if (!id) return

    setSubmitError(null)

    await handleUpdate(id, formData)

    // closeDialog()

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

            borderColor: 'var(--color-icon)',

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

              background: 'color-mix(in srgb, var(--color-gold) 15%, transparent)',

              display: 'flex',

              alignItems: 'center',

              justifyContent: 'center'

            }}>

              <Building2 size={48} style={{ color: 'var(--color-icon)' }} />

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

            <MapPin size={14} style={{ color: 'var(--color-icon)' }} />

            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>

              {hall.location}

            </MuiTypography>

          </MuiBox>



          <MuiGrid container spacing={1} sx={{ mt: 1 }}>

            <MuiGrid item xs={6}>

              <MuiBox sx={{ p: 1, borderRadius: '12px', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', gap: 1 }}>

                <Users size={14} style={{ color: 'var(--color-icon)' }} />

                <MuiTypography variant="caption" sx={{ fontWeight: 600 }}>{hall.capacity}</MuiTypography>

              </MuiBox>

            </MuiGrid>

            <MuiGrid item xs={6}>

              <MuiBox sx={{ p: 1, borderRadius: '12px', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', gap: 1 }}>

                <DollarSign size={14} style={{ color: 'var(--color-icon)' }} />

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

    <MuiBox sx={{ p: { xs: 1.5, sm: 2 }, maxWidth: '100%' }}>

      <SEOHead pageKey="hallsManagement" title="إدارة قاعة/صالة | INVOCCA" />

      {/* CrudPageLayout - مكون موحد للتخطيط */}
      <CrudPageLayout
        stats={[
          {
            title: "عدد قاعات/صالات",
            value: halls.length,
            icon: <Building2 size={24} />
          },
          {
            title: "قاعات/صالات النشطة",
            value: halls.filter(h => h.isActive).length,
            icon: <CheckCircle size={24} />
          },
          {
            title: "إجمالي السعة",
            value: halls.reduce((sum, hall) => sum + (hall.capacity || 0), 0),
            icon: <Users size={24} />
          },
          {
            title: "متوسط السعر",
            value: formatCurrency(halls.length > 0 ? halls.reduce((sum, h) => sum + (h.defaultPrices || 0), 0) / halls.length : 0),
            icon: <DollarSign size={24} />
          }
        ]}
        filterConfig={filterConfig}
        onSearch={setSearchQuery}
        onFilterChange={setActiveFilters}
        onRefresh={fetchHalls}
        searchPlaceholder="بحث ..."
        columns={columns}
        data={filteredHalls}
        loading={loading}
        emptyMessage="لا توجد قاعات/صالات متاحة"
        addButtonLabel="إضافة قاعة/صالة"
        onAdd={handleCreateClick}
        onEdit={handleEditClick}
        onDelete={openDeleteDialog}
        onView={openViewDialog}
        onToggleStatus={handleToggleStatus}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        dataTableSx={{
          minWidth: 850,
          fontSize: '0.75rem',
          '& .MuiTableCell-root': {
            padding: '10px 10px',
            fontSize: '0.75rem',
            whiteSpace: 'normal',
            maxWidth: '150px',
            wordBreak: 'break-word',
            lineHeight: 1.4
          },
          '& .MuiTableHead-root .MuiTableCell-root': {
            fontWeight: 700,
            fontSize: '0.85rem',
            padding: '12px 16px',
            whiteSpace: 'nowrap',
            maxWidth: '120px',
            backgroundColor: 'var(--color-gold)',
            borderBottom: '3px solid var(--color-gold)',
            color: 'var(--color-dark)',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            borderRadius: '8px 8px 0 0',
            '&:hover': {
              backgroundColor: 'color-mix(in srgb, var(--color-gold) 90%, var(--color-dark) 10%)'
            }
          },
          '& .MuiTableCell:nth-of-type(1)': {
            maxWidth: '200px',
            minWidth: '150px'
          },
          '& .MuiTableCell:nth-of-type(2)': {
            width: '80px',
            minWidth: '60px',
            textAlign: 'center'
          },
          '& .MuiTableCell:nth-of-type(3)': {
            width: '100px',
            minWidth: '80px',
            textAlign: 'center'
          },
          '& .MuiTableCell:nth-of-type(4)': {
            maxWidth: '180px',
            minWidth: '120px'
          },
          '& .MuiTableCell:nth-of-type(5)': {
            width: '100px',
            minWidth: '90px',
            textAlign: 'center',
            whiteSpace: 'nowrap'
          },
          '& .MuiTableCell:nth-of-type(6)': {
            width: '90px',
            minWidth: '80px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            '& .MuiChip-root': {
              backgroundColor: (value) => value ? 'rgba(34, 197, 94, 0.15)' : 'rgba(220, 38, 38, 0.15)',
              color: (value) => value ? '#22c55e' : '#dc2626',
              border: (value) => `1px solid ${value ? '#22c55e' : '#dc2626'}`,
              fontWeight: 500
            }
          },
          '& .MuiTableCell:last-child': {
            width: '160px',
            minWidth: '140px',
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }
        }}
      />



      {/* Dialogs */}

      <CreateEditHallDialog

        key={selectedHall?.id || selectedHall?._id || 'new'}

        open={isCreate || isEdit}

        onClose={closeDialog}

        onSubmit={isCreate ? handleCreateSubmit : handleUpdateSubmit}

        editingHall={isEdit ? selectedHall : null}

        loading={crudLoading}

        error={submitError}

        onClearError={() => setSubmitError(null)}

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
