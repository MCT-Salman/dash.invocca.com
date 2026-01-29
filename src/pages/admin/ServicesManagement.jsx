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
import { LoadingScreen, EmptyState, SEOHead, DataTable, FormDialog, ConfirmDialog, PageHeader, StatCard, CardsView } from '@/components/common'
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
    Download,
    Pencil,
    Table,
    LayoutGrid,
    MessageSquare,
    Check
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
    const [viewMode, setViewMode] = useState('table') // 'table' or 'card'

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

    const renderServiceCard = (service) => {
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
                <MuiBox sx={{
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--color-primary-50)',
                    borderBottom: '1px solid var(--color-divider)'
                }}>
                    <MuiBox sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '16px',
                        background: 'var(--color-paper)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-sm)',
                        color: 'var(--color-primary-500)'
                    }}>
                        <Package size={32} />
                    </MuiBox>
                </MuiBox>

                <MuiCardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <MuiTypography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                            {service.name}
                        </MuiTypography>
                        <MuiChip
                            label={service.isActive ? 'نشط' : 'معطل'}
                            size="small"
                            color={service.isActive ? 'success' : 'default'}
                            sx={{ fontWeight: 600 }}
                        />
                    </MuiBox>

                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '3em' }}>
                        {service.description || 'لا يوجد وصف متاح'}
                    </MuiTypography>

                    <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 'auto' }}>
                        <MuiChip
                            icon={<Tag size={12} />}
                            label={SERVICE_CATEGORY_LABELS[service.category] || service.category}
                            size="small"
                            variant="outlined"
                        />
                        <MuiChip
                            icon={<DollarSign size={12} />}
                            label={formatCurrency(service.basePrice)}
                            size="small"
                            sx={{ background: 'var(--color-success-50)', color: 'var(--color-success-700)', fontWeight: 700 }}
                        />
                    </MuiBox>
                </MuiCardContent>

                <MuiCardActions sx={{ px: 2, py: 1.5, borderTop: '1px solid var(--color-divider)', justifyContent: 'flex-end', gap: 1 }}>
                    <MuiIconButton size="small" onClick={() => openViewDialog(service)} color="primary">
                        <Eye size={18} />
                    </MuiIconButton>
                    <MuiIconButton size="small" onClick={() => handleEditClick(service)} color="info">
                        <Pencil size={18} />
                    </MuiIconButton>
                    <MuiIconButton size="small" onClick={() => openDeleteDialog(service)} color="error">
                        <Trash2 size={18} />
                    </MuiIconButton>
                </MuiCardActions>
            </MuiCard>
        )
    }


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

            <PageHeader
                icon={Package}
                title={`إدارة الخدمات (${filteredServices.length})`}
                subtitle="إدارة جميع خدمات المناسبات المتاحة في النظام"
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
                        >
                            إضافة خدمة
                        </MuiButton>
                    </MuiBox>
                }
            />

            {/* Stats Cards */}
            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="عدد الخدمات"
                        value={services.length}
                        icon={<Package size={24} />}
                        color="primary"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="الخدمات النشطة"
                        value={services.filter(s => s.isActive).length}
                        icon={<CheckCircle size={24} />}
                        color="success"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="الخدمات غير نشطة"
                        value={services.filter(s => !s.isActive).length}
                        icon={<XCircle size={24} />}
                        color="error"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="متوسط السعر"
                        value={services.length > 0 ? Math.round(services.reduce((sum, service) => sum + (service.basePrice || 0), 0) / services.length) : 0}
                        icon={<DollarSign size={24} />}
                        color="info"
                    />
                </MuiGrid>
            </MuiGrid>

            <MuiPaper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    background: 'var(--color-paper)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '20px'
                }}
            >
                <MuiGrid container spacing={2} alignItems="center">
                    <MuiGrid item xs={12} md={6}>
                        <MuiTextField
                            fullWidth
                            placeholder="البحث عن خدمة..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            startIcon={<Search size={20} />}
                        />
                    </MuiGrid>
                    <MuiGrid item xs={12} md={3}>
                        <MuiSelect
                            fullWidth
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <MuiMenuItem value="all">جميع الفئات</MuiMenuItem>
                            {Array.isArray(categories) && categories.map(cat => (
                                <MuiMenuItem key={cat.value || cat.id || cat} value={cat.value || cat.id || cat}>
                                    {SERVICE_CATEGORY_LABELS[cat.value || cat.id || cat] || cat.label || cat.name || cat}
                                </MuiMenuItem>
                            ))}
                        </MuiSelect>
                    </MuiGrid>
                    <MuiGrid item xs={12} md={3}>
                        <MuiSelect
                            fullWidth
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <MuiMenuItem value="all">جميع الحالات</MuiMenuItem>
                            <MuiMenuItem value="active">نشطة</MuiMenuItem>
                            <MuiMenuItem value="inactive">غير نشطة</MuiMenuItem>
                        </MuiSelect>
                    </MuiGrid>
                </MuiGrid>

                <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, pt: 3, borderTop: '1px solid var(--color-divider)' }}>
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
                            >
                                مسح الفلاتر
                            </MuiButton>
                        )}
                    </MuiBox>
                    <MuiBox sx={{ display: 'flex', gap: 2 }}>
                        <MuiButton
                            variant="outlined"
                            startIcon={<RefreshCw size={20} />}
                            onClick={handleRefresh}
                        >
                            تحديث
                        </MuiButton>
                        <MuiButton
                            variant="contained"
                            startIcon={<Plus size={20} />}
                            onClick={handleCreateClick}
                        >
                            إضافة خدمة
                        </MuiButton>
                    </MuiBox>
                </MuiBox>
            </MuiPaper>

            {/* Services Table/Cards */}
            {viewMode === 'table' ? (
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
                />
            ) : (
                <CardsView
                    data={filteredServices}
                    renderCard={renderServiceCard}
                    loading={isLoading}
                    emptyMessage="لا توجد خدمات متاحة"
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
        </MuiBox >
    )
}

