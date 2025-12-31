import { useState, useMemo } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useTheme, useMediaQuery } from '@mui/material'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

// MUI Components
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiButton from '@/components/ui/MuiButton'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiChip from '@/components/ui/MuiChip'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiInputAdornment from '@/components/ui/MuiInputAdornment'
import MuiDialog from '@/components/ui/MuiDialog'
import MuiDialogTitle from '@/components/ui/MuiDialogTitle'
import MuiDialogContent from '@/components/ui/MuiDialogContent'
import MuiDialogActions from '@/components/ui/MuiDialogActions'
import MuiIconButton from '@/components/ui/MuiIconButton'
import MuiStack from '@/components/ui/MuiStack'

// Layout & Common Components
import { LoadingScreen, EmptyState, SEOHead, DataTable, FormDialog, ConfirmDialog } from '@/components/common'
import ViewServiceDialog from './components/ViewServiceDialog'

// Hooks & Utilities
import { useNotification, useDebounce, useDialogState, useCRUD } from '@/hooks'
import { QUERY_KEYS, SERVICE_CATEGORY_LABELS, SERVICE_UNIT_LABELS } from '@/config/constants'
import { getServicesList, getServiceCategories, createService, updateService, deleteService } from '@/api/admin'
import { formatCurrency, generateExportFileName } from '@/utils/helpers'

// Icons
import {
    ClipboardList,
    Search,
    Plus,
    RefreshCw,
    CheckCircle,
    XCircle,
    Package,
    Layers,
    Tag,
    DollarSign,
    Trash2,
    X,
    Eye,
    Download
} from 'lucide-react'

// ====================== Main Component ======================
export default function ServicesManagement() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const { addNotification: showNotification } = useNotification()

    // State
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 500)
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')

    // Dialog state management
    const {
        dialogOpen,
        dialogType,
        selectedItem: selectedService,
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

    // Form state (kept for complex form with requirements array)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        basePrice: 0,
        unit: 'per_person',
        requirements: []
    })
    const [newRequirement, setNewRequirement] = useState('')

    // Fetch Services
    const { data: servicesData, isLoading, refetch } = useQuery({
        queryKey: QUERY_KEYS.ADMIN_SERVICES,
        queryFn: getServicesList,
    })

    // Fetch Categories
    const { data: categoriesData } = useQuery({
        queryKey: ['admin', 'service-categories'],
        queryFn: getServiceCategories,
    })

    const services = servicesData?.data || servicesData || []
    const categories = categoriesData?.data || categoriesData || []

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
        createFn: createService,
        updateFn: updateService,
        deleteFn: deleteService,
        queryKey: QUERY_KEYS.ADMIN_SERVICES,
        successMessage: 'تمت العملية بنجاح',
        errorMessage: 'حدث خطأ أثناء العملية',
    })

    // Filtered Services
    const filteredServices = useMemo(() => {
        let filtered = Array.isArray(services) ? services : []

        if (debouncedSearch) {
            filtered = filtered.filter(service =>
                service.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                service.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
            )
        }

        if (categoryFilter !== 'all') {
            filtered = filtered.filter(service => service.category === categoryFilter)
        }

        // Apply status filter
        if (statusFilter && statusFilter !== 'all') {
            filtered = filtered.filter(service => {
                if (statusFilter === 'active') return service.isActive === true
                if (statusFilter === 'inactive') return service.isActive === false
                return true
            })
        }

        return filtered
    }, [services, debouncedSearch, categoryFilter, statusFilter])

    // Table Columns
    const columns = [
        {
            id: 'name',
            label: 'الخدمة',
            align: 'right',
            format: (value, row) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MuiBox
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '10px',
                            background: 'rgba(216, 185, 138, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(216, 185, 138, 0.2)',
                        }}
                    >
                        <Package size={20} style={{ color: 'var(--color-primary-500)' }} />
                    </MuiBox>
                    <MuiBox>
                        <MuiTypography variant="body2" component="span" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                            {value}
                        </MuiTypography>
                        <MuiTypography variant="caption" component="span" sx={{ color: 'var(--color-text-secondary)', display: 'block', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {row.description || '—'}
                        </MuiTypography>
                    </MuiBox>
                </MuiBox>
            )
        },
        {
            id: 'category',
            label: 'الفئة',
            align: 'center',
            format: (value) => (
                <MuiChip
                    label={SERVICE_CATEGORY_LABELS[value] || value}
                    size="small"
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--color-primary-300)',
                        fontWeight: 600,
                        border: '1px solid var(--color-border-glass)',
                    }}
                    icon={<Tag size={12} />}
                />
            )
        },
        {
            id: 'basePrice',
            label: 'السعر الأساسي',
            align: 'center',
            format: (value) => (
                <MuiTypography variant="body2" component="span" sx={{ color: 'var(--color-primary-400)', fontWeight: 700 }}>
                    {formatCurrency(value)}
                </MuiTypography>
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


    const handleToggleStatus = async (service) => {
        try {
            const updatedService = { ...service, isActive: !service.isActive }
            const id = service.id || service._id
            if (!id) return
            await handleUpdate(id, updatedService)
        } catch (error) {
            // Error handled by useCRUD
        }
    }

    const handleAddRequirement = () => {
        if (newRequirement.trim()) {
            setFormData(prev => ({
                ...prev,
                requirements: [...prev.requirements, newRequirement.trim()]
            }))
            setNewRequirement('')
        }
    }

    const handleRemoveRequirement = (index) => {
        setFormData(prev => ({
            ...prev,
            requirements: prev.requirements.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e) => {
        e?.preventDefault?.()
        const id = selectedService?.id || selectedService?._id
        try {
            if (isEdit && id) {
                await handleUpdate(id, formData)
            } else {
                await handleCreate(formData)
            }
            closeDialog()
        } catch (error) {
            // Error handled by useCRUD
        }
    }

    const handleEditClick = (service) => {
        openEditDialog(service)
        setFormData({
            name: service.name || '',
            description: service.description || '',
            category: service.category || '',
            basePrice: service.basePrice || 0,
            unit: service.unit || 'per_person',
            requirements: Array.isArray(service.requirements) ? service.requirements : []
        })
    }

    const handleCreateClick = () => {
        openCreateDialog()
        setFormData({
            name: '',
            description: '',
            category: '',
            basePrice: 0,
            unit: 'per_person',
            requirements: []
        })
        setNewRequirement('')
    }

    const handleDeleteConfirm = async () => {
        const id = selectedService?.id || selectedService?._id
        if (!id) return
        await handleDelete(id)
        closeDialog()
    }

    const handleRefresh = () => {
        refetch()
        showNotification({ title: 'تحديث', message: 'تم تحديث البيانات بنجاح', type: 'success' })
    }

    const handleExport = () => {
        try {
            const worksheet = XLSX.utils.json_to_sheet(
                filteredServices.map(service => ({
                    'اسم الخدمة': service.name,
                    'الوصف': service.description || '',
                    'الفئة': SERVICE_CATEGORY_LABELS[service.category] || service.category,
                    'السعر الأساسي': service.basePrice,
                    'وحدة القياس': SERVICE_UNIT_LABELS[service.unit] || service.unit,
                    'الحالة': service.isActive ? 'نشطة' : 'غير نشطة',
                    'المتطلبات': service.requirements?.join(', ') || ''
                }))
            )

            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, 'الخدمات')
            const fileName = generateExportFileName('services')
            XLSX.writeFile(workbook, fileName)

            showNotification({
                title: 'نجاح',
                message: 'تم تصدير الخدمات بنجاح',
                type: 'success'
            })
        } catch (error) {
            showNotification({
                title: 'خطأ',
                message: 'فشل تصدير الخدمات',
                type: 'error'
            })
        }
    }

    if (isLoading) return <LoadingScreen message="جاري تحميل الخدمات..." />

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
            <SEOHead pageKey="servicesManagement" title="إدارة الخدمات | INVOCCA" />

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
                            <Package size={28} className="text-white" />
                        </MuiBox>
                        <MuiBox>
                            <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700, mb: 0.5 }}>
                                إدارة الخدمات ({filteredServices.length})
                            </MuiTypography>
                            <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                                إدارة جميع خدمات المناسبات في النظام
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
                                    {services.length}
                                </MuiTypography>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                                    عدد الخدمات
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
                                <Package size={28} style={{ color: '#D8B98A' }} />
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
                            border: '1px solid rgba(34, 197, 94, 0.2)',
                            borderRadius: '16px',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                                borderColor: 'var(--color-success-500)',
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, var(--color-success-500), transparent)',
                            }
                        }}
                    >
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <MuiBox>
                                <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                                    {services.filter(s => s.isActive).length}
                                </MuiTypography>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                                    الخدمات النشطة
                                </MuiTypography>
                            </MuiBox>
                            <MuiBox
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: '12px',
                                    background: 'rgba(34, 197, 94, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid rgba(34, 197, 94, 0.2)',
                                }}
                            >
                                <CheckCircle size={28} style={{ color: '#22c55e' }} />
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
                                borderColor: 'var(--color-error-500)',
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, var(--color-error-500), transparent)',
                            }
                        }}
                    >
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <MuiBox>
                                <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                                    {services.filter(s => !s.isActive).length}
                                </MuiTypography>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                                    الخدمات غير نشطة
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
                                <XCircle size={28} style={{ color: '#dc2626' }} />
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
                                borderColor: 'var(--color-info-500)',
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, var(--color-info-500), transparent)',
                            }
                        }}
                    >
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <MuiBox>
                                <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                                    {services.length > 0
                                        ? Math.round(services.reduce((sum, service) => sum + (service.basePrice || 0), 0) / services.length)
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
                                    background: 'rgba(2, 132, 199, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid rgba(2, 132, 199, 0.2)',
                                }}
                            >
                                <DollarSign size={28} style={{ color: '#0284c7' }} />
                            </MuiBox>
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>
            </MuiGrid>

            {/* Search & Filter */}
            <MuiPaper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 3,
                    background: 'var(--color-surface-dark)',
                    border: '1px solid var(--color-border-glass)',
                    borderRadius: '16px'
                }}
            >
                <MuiGrid container spacing={2} alignItems="center">
                    <MuiGrid item xs={12} md={6}>
                        <MuiTextField
                            fullWidth
                            placeholder="البحث عن خدمة..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <MuiInputAdornment position="start">
                                        <Search size={20} style={{ color: 'var(--color-text-secondary)' }} />
                                    </MuiInputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                }
                            }}
                        />
                    </MuiGrid>
                    <MuiGrid item xs={12} md={3}>
                        <MuiSelect
                            fullWidth
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            sx={{
                                borderRadius: '10px',
                            }}
                        >
                            <MuiMenuItem value="all">جميع الفئات</MuiMenuItem>
                            {Array.isArray(categories) && categories.map(cat => {
                                const catValue = typeof cat === 'object' ? cat.value || cat.id || cat : cat
                                const catLabel = typeof cat === 'object' ? cat.label || cat.name || cat : cat
                                return (
                                    <MuiMenuItem key={catValue} value={catValue}>
                                        {SERVICE_CATEGORY_LABELS[catValue] || catLabel}
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
                        {(categoryFilter !== 'all' || statusFilter !== 'all' || searchTerm) && (
                            <MuiButton
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                    setCategoryFilter('all')
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
                            disabled={services.length === 0}
                        >
                            تصدير
                        </MuiButton>
                        <MuiButton
                            variant="contained"
                            startIcon={<Plus size={20} />}
                            onClick={handleCreateClick}
                            color="primary"
                        >
                            إضافة خدمة
                        </MuiButton>
                    </MuiBox>
                </MuiBox>
            </MuiPaper>

            {/* Services Table */}
            {filteredServices.length === 0 ? (
                <EmptyState
                    title="لا يوجد خدمات"
                    description="لم يتم العثور على أي خدمات تطابق بحثك"
                    icon={ClipboardList}
                    showPaper
                />
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredServices}
                    onEdit={handleEditClick}
                    onDelete={openDeleteDialog}
                    onView={openViewDialog}
                    onToggleStatus={handleToggleStatus}
                    loading={isLoading}
                    emptyMessage="لا توجد خدمات متاحة"
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

            {/* Service Dialog */}
            <FormDialog
                open={(isCreate || isEdit)}
                onClose={closeDialog}
                title={isCreate ? 'إضافة خدمة جديدة' : 'تعديل الخدمة'}
                onSubmit={handleSubmit}
                loading={crudLoading}
                submitText={isCreate ? 'إضافة' : 'تحديث'}
                cancelText="إلغاء"
            >
                <MuiStack spacing={3}>
                    <MuiTextField
                        fullWidth
                        label="اسم الخدمة"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <MuiTextField
                        fullWidth
                        label="الوصف"
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />

                    <MuiGrid container spacing={2}>
                        <MuiGrid item xs={12} sm={6}>
                            <MuiSelect
                                fullWidth
                                label="الفئة"
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                sx={{
                                    borderRadius: '10px',
                                }}
                            >
                                <MuiMenuItem value="" disabled>اختر الفئة</MuiMenuItem>
                                {Array.isArray(categories) && categories.map(cat => {
                                    const catValue = typeof cat === 'object' ? cat.value || cat.id || cat : cat
                                    const catLabel = typeof cat === 'object' ? cat.label || cat.name || cat : cat
                                    return (
                                        <MuiMenuItem key={catValue} value={catValue}>
                                            {SERVICE_CATEGORY_LABELS[catValue] || catLabel}
                                        </MuiMenuItem>
                                    )
                                })}
                            </MuiSelect>
                        </MuiGrid>
                        <MuiGrid item xs={12} sm={6}>
                            <MuiSelect
                                fullWidth
                                label="وحدة القياس"
                                required
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                sx={{
                                    borderRadius: '10px',
                                }}
                            >
                                {Object.entries(SERVICE_UNIT_LABELS).map(([value, label]) => (
                                    <MuiMenuItem key={value} value={value}>{label}</MuiMenuItem>
                                ))}
                            </MuiSelect>
                        </MuiGrid>
                    </MuiGrid>

                            <MuiTextField
                                fullWidth
                                label="السعر الأساسي"
                                type="number"
                                required
                                value={formData.basePrice}
                                onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                                InputProps={{
                                    startAdornment: (
                                        <MuiInputAdornment position="start">
                                            <DollarSign size={20} style={{ color: 'var(--color-primary-400)' }} />
                                        </MuiInputAdornment>
                                    ),
                                }}
                            />

                            {/* Requirements Array */}
                            <MuiBox>
                                <MuiTypography variant="subtitle2" sx={{ color: 'var(--color-primary-300)', mb: 1, fontWeight: 600 }}>
                                    المتطلبات (اختياري)
                                </MuiTypography>
                                <MuiBox sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                    <MuiTextField
                                        fullWidth
                                        size="small"
                                        placeholder="أضف متطلب جديد..."
                                        value={newRequirement}
                                        onChange={(e) => setNewRequirement(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
                                    />
                                    <MuiButton
                                        variant="outlined"
                                        onClick={handleAddRequirement}
                                        disabled={!newRequirement.trim()}
                                        sx={{ borderColor: 'var(--color-primary-500)', color: 'var(--color-primary-500)' }}
                                    >
                                        إضافة
                                    </MuiButton>
                                </MuiBox>
                                <MuiStack spacing={1}>
                                    {formData.requirements.map((req, index) => (
                                        <MuiPaper
                                            key={req.id || `req-${index}`}
                                            sx={{
                                                px: 2,
                                                py: 1,
                                                background: 'rgba(255,255,255,0.03)',
                                                border: '1px solid var(--color-border-glass)',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                borderRadius: '8px'
                                            }}
                                        >
                                            <MuiTypography variant="body2">{req}</MuiTypography>
                                            <MuiIconButton size="small" color="error" onClick={() => handleRemoveRequirement(index)}>
                                                <X size={16} />
                                            </MuiIconButton>
                                        </MuiPaper>
                                    ))}
                                </MuiStack>
                            </MuiBox>
                        </MuiStack>
            </FormDialog>

            {/* View Dialog */}
            <ViewServiceDialog
                open={isView}
                onClose={closeDialog}
                service={selectedService}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={isDelete}
                onClose={closeDialog}
                onConfirm={handleDeleteConfirm}
                title="حذف الخدمة"
                message={`هل أنت متأكد من حذف الخدمة "${selectedService?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
                confirmLabel="حذف"
                cancelLabel="إلغاء"
                loading={crudLoading}
            />
        </MuiBox>
    )
}

