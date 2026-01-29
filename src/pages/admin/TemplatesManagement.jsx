import { useState, useMemo } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useTheme, useMediaQuery } from '@mui/material'
import * as XLSX from 'xlsx'

// MUI Components
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiButton from '@/components/ui/MuiButton'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiChip from '@/components/ui/MuiChip'
import MuiCard from '@/components/ui/MuiCard'
import MuiCardContent from '@/components/ui/MuiCardContent'
import MuiCardActions from '@/components/ui/MuiCardActions'
import MuiInputAdornment from '@/components/ui/MuiInputAdornment'
import MuiIconButton from '@/components/ui/MuiIconButton'
import MuiDialog from '@/components/ui/MuiDialog'
import MuiDialogContent from '@/components/ui/MuiDialogContent'
import MuiDialogActions from '@/components/ui/MuiDialogActions'
import MuiDialogTitle from '@/components/ui/MuiDialogTitle'
import MuiDivider from '@/components/ui/MuiDivider'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiAvatar from '@/components/ui/MuiAvatar'

// Layout & Common Components
import { LoadingScreen, EmptyState, SEOHead, DataTable, ConfirmDialog, PageHeader, StatCard, CardsView } from '@/components/common'

// Dialog Components
import ViewTemplateDialog from './components/ViewTemplateDialog'
import CreateEditTemplateDialog from './components/CreateEditTemplateDialog'

// Hooks & Utilities
import { useDebounce, useDialogState, useCRUD } from '@/hooks'
import { QUERY_KEYS } from '@/config/constants'
import { getTemplates, createTemplate, updateTemplate, deleteTemplate } from '@/api/admin'
import { formatDate, generateExportFileName } from '@/utils/helpers'

// Icons
import {
    Image as ImageIcon,
    Search,
    Plus,
    RefreshCw,
    CheckCircle,
    XCircle,
    FileText,
    Upload,
    Eye,
    Trash2,
    Edit2,
    Download,
    Filter,
    X,
    Package,
    Tag,
    DollarSign,
    Calendar,
    Building2,
    Users,
    MapPin,
    LayoutGrid,
    Table
} from 'lucide-react'

// ====================== Main Component ======================
export default function TemplatesManagement() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    // State
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 500)
    const [viewMode, setViewMode] = useState('card') // 'card' or 'table'

    // Dialog state management
    const {
        dialogOpen,
        dialogType,
        selectedItem: selectedTemplate,
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
        createFn: createTemplate,
        updateFn: updateTemplate,
        deleteFn: deleteTemplate,
        queryKey: QUERY_KEYS.ADMIN_TEMPLATES,
        successMessage: 'تمت العملية بنجاح',
        errorMessage: 'حدث خطأ أثناء العملية',
    })

    // Fetch Templates
    const { data: templatesData, isLoading, refetch } = useQuery({
        queryKey: QUERY_KEYS.ADMIN_TEMPLATES,
        queryFn: getTemplates,
    })

    const templates = templatesData?.templates || templatesData?.data || templatesData || []

    // Filtered Templates
    const filteredTemplates = useMemo(() => {
        let filtered = Array.isArray(templates) ? templates : []

        if (debouncedSearch) {
            filtered = filtered.filter(template =>
                template.templateName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                template.hallId?.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                template.hallId?.location?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                template.hallId?.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                template._id?.toLowerCase().includes(debouncedSearch.toLowerCase())
            )
        }

        return filtered
    }, [templates, debouncedSearch])

    // Table Columns
    const columns = [
        {
            id: 'templateName',
            label: 'اسم القالب',
            align: 'right',
            format: (value, row) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MuiBox
                        sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '8px',
                            overflow: 'hidden',
                            background: 'rgba(216, 185, 138, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(216, 185, 138, 0.2)',
                        }}
                    >
                        {row.imageUrl ? (
                            <img
                                src={row.imageUrl.startsWith('http') ? row.imageUrl : `${import.meta.env.VITE_API_BASE}${row.imageUrl}`}
                                alt={value}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <ImageIcon size={24} style={{ color: 'var(--color-primary-500)' }} />
                        )}
                    </MuiBox>
                    <MuiBox>
                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                            {value}
                        </MuiTypography>
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                            {row.description || '—'}
                        </MuiTypography>
                    </MuiBox>
                </MuiBox>
            )
        },
        // {
        //     id: 'hallId',
        //     label: 'قاعة/صالة',
        //     align: 'right',
        //     format: (value) => (
        //         <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        //             <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        //                 <Building2 size={16} style={{ color: 'var(--color-primary-400)' }} />
        //                 <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
        //                     {value?.name || 'قاعة/صالة غير محددة'}
        //                 </MuiTypography>
        //             </MuiBox>
        //             <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        //                 <MapPin size={14} style={{ color: 'var(--color-primary-300)' }} />
        //                 <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
        //                     {value?.location || '—'}
        //                 </MuiTypography>
        //             </MuiBox>
        //         </MuiBox>
        //     )
        // },
        // {
        //     id: 'capacity',
        //     label: 'السعة',
        //     align: 'center',
        //     format: (value, row) => (
        //         <MuiBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
        //             <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        //                 <Users size={16} style={{ color: 'var(--color-primary-400)' }} />
        //                 <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
        //                     {row.hallId?.capacity || value || '—'}
        //                 </MuiTypography>
        //             </MuiBox>
        //             <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
        //                 {row.hallId?.tables ? `${row.hallId.tables} طاولة` : ''}
        //                 {row.hallId?.tables && row.hallId?.chairs ? ' • ' : ''}
        //                 {row.hallId?.chairs ? `${row.hallId?.chairs} كرسي` : ''}
        //             </MuiTypography>
        //         </MuiBox>
        //     )
        // },
        // {
        //     id: 'price',
        //     label: 'السعر',
        //     align: 'center',
        //     format: (value, row) => (
        //         <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
        //             <DollarSign size={16} style={{ color: 'var(--color-primary-400)' }} />
        //             <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
        //                 {row.hallId?.defaultPrices ? `${row.hallId.defaultPrices} ريال` : '—'}
        //             </MuiTypography>
        //         </MuiBox>
        //     )
        // },
        {
            id: 'createdAt',
            label: 'تاريخ الإنشاء',
            align: 'center',
            format: (value) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                    <Calendar size={16} style={{ color: 'var(--color-primary-400)' }} />
                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                        {formatDate(value, 'DD/MM/YYYY')}
                    </MuiTypography>
                </MuiBox>
            )
        },
    ]

    const renderTemplateCard = (template) => {
        const imageUrl = template.imageUrl ? (template.imageUrl.startsWith('http') ? template.imageUrl : `${import.meta.env.VITE_API_BASE}${template.imageUrl}`) : null
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
                <MuiBox sx={{ position: 'relative', height: 200, background: 'var(--color-primary-100)' }}>
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={template.templateName}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <MuiBox sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <ImageIcon size={48} style={{ color: 'var(--color-primary-300)' }} />
                        </MuiBox>
                    )}
                    <MuiChip
                        label={template.category || 'عام'}
                        size="small"
                        sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 700, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}
                    />
                </MuiBox>

                <MuiCardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <MuiTypography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'var(--color-text-primary)' }}>
                        {template.templateName}
                    </MuiTypography>
                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {template.description || 'لا يوجد وصف متاح لهذا القالب'}
                    </MuiTypography>

                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Calendar size={14} style={{ color: 'var(--color-primary-500)' }} />
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-muted)' }}>
                            تاريخ الإضافة: {formatDate(template.createdAt, 'DD/MM/YYYY')}
                        </MuiTypography>
                    </MuiBox>
                </MuiCardContent>

                <MuiCardActions sx={{ px: 2, py: 1.5, borderTop: '1px solid var(--color-divider)', justifyContent: 'flex-end', gap: 1 }}>
                    <MuiIconButton size="small" onClick={() => openViewDialog(template)} color="primary">
                        <Eye size={18} />
                    </MuiIconButton>
                    <MuiIconButton size="small" onClick={() => openEditDialog(template)} color="info">
                        <Edit2 size={18} />
                    </MuiIconButton>
                    <MuiIconButton size="small" onClick={() => openDeleteDialog(template)} color="error">
                        <Trash2 size={18} />
                    </MuiIconButton>
                </MuiCardActions>
            </MuiCard>
        )
    }

    const handleCreateClick = () => {
        openCreateDialog()
    }


    const handleDeleteConfirm = async () => {
        const id = selectedTemplate?._id || selectedTemplate?.id
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
                filteredTemplates.map(template => ({
                    'اسم القالب': template.templateName,
                    'قاعة/صالة': template.hallId?.name || '—',
                    'موقع قاعة/صالة': template.hallId?.location || '—',
                    'السعة': template.hallId?.capacity || '—',
                    'الطاولات': template.hallId?.tables || '—',
                    'الكراسي': template.hallId?.chairs || '—',
                    'السعر الافتراضي': template.hallId?.defaultPrices ? `${template.hallId.defaultPrices} ريال` : '—',
                    'الوصف': template.hallId?.description || '—',
                    'الحالة': template.isActive !== false ? 'نشط' : 'معطل',
                    'تاريخ الإضافة': formatDate(template.createdAt, 'DD/MM/YYYY'),
                    'تاريخ التحديث': formatDate(template.updatedAt, 'DD/MM/YYYY'),
                    'معرّف القالب': template._id,
                    'معرّف قاعة/صالة': template.hallId?._id || '—'
                }))
            )
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, 'القوالب')
            XLSX.writeFile(workbook, generateExportFileName('templates'))
            showNotification({ title: 'نجاح', message: 'تم تصدير القوالب بنجاح', type: 'success' })
        } catch (error) {
            showNotification({ title: 'خطأ', message: 'فشل تصدير القوالب', type: 'error' })
        }
    }

    if (isLoading) return <LoadingScreen message="جاري تحميل القوالب..." />

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
            <SEOHead title="إدارة القوالب | INVOCCA" />

            <PageHeader
                icon={ImageIcon}
                title={`إدارة القوالب (${filteredTemplates.length})`}
                subtitle="إدارة قوالب بطاقات الدعوة والمستندات الرسمية المتاحة في النظام"
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
                            disabled={filteredTemplates.length === 0}
                        >
                            تصدر
                        </MuiButton>
                        <MuiButton
                            variant="contained"
                            startIcon={<Upload size={20} />}
                            onClick={handleCreateClick}
                        >
                            رفع قالب جديد
                        </MuiButton>
                    </MuiBox>
                }
            />

            {/* Stats Cards */}
            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="عدد القوالب"
                        value={filteredTemplates.length}
                        icon={<ImageIcon size={24} />}
                        color="primary"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="قوالب نشطة"
                        value={filteredTemplates.filter(t => t.isActive !== false).length}
                        icon={<CheckCircle size={24} />}
                        color="success"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="قوالب معطلة"
                        value={filteredTemplates.filter(t => t.isActive === false).length}
                        icon={<XCircle size={24} />}
                        color="error"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="الفئات"
                        value={[...new Set(filteredTemplates.map(t => t.category).filter(Boolean))].length}
                        icon={<Filter size={24} />}
                        color="info"
                    />
                </MuiGrid>
            </MuiGrid>

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
                            placeholder="البحث باسم القالب أو الفئة..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            startIcon={<Search size={20} />}
                        />
                    </MuiGrid>
                    <MuiGrid item xs={12} md={4}>
                        <MuiButton
                            fullWidth
                            variant="outlined"
                            startIcon={<RefreshCw size={20} />}
                            onClick={handleRefresh}
                        >
                            تحديث البيانات
                        </MuiButton>
                    </MuiGrid>
                </MuiGrid>
            </MuiPaper>

            {/* Templates Grid/Table */}
            {viewMode === 'table' ? (
                <DataTable
                    columns={columns}
                    data={filteredTemplates}
                    onEdit={openEditDialog}
                    onDelete={openDeleteDialog}
                    onView={openViewDialog}
                    loading={isLoading}
                    emptyMessage="لا توجد خدمات متاحة"
                    showActions={true}
                />
            ) : (
                <CardsView
                    data={filteredTemplates}
                    renderCard={renderTemplateCard}
                    loading={isLoading}
                    emptyMessage="لا توجد قوالب متاحة"
                />
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={isDelete}
                onClose={closeDialog}
                onConfirm={handleDeleteConfirm}
                title="حذف القالب"
                message={`هل أنت متأكد من حذف القالب "${selectedTemplate?.templateName}"؟ لا يمكن التراجع عن هذا الإجراء.`}
                confirmLabel="حذف"
                cancelLabel="إلغاء"
                loading={crudLoading}
            />

            {/* View Template Dialog */}
            <ViewTemplateDialog
                open={isView}
                onClose={closeDialog}
                template={selectedTemplate}
            />

            {/* Create/Edit Template Dialog */}
            <CreateEditTemplateDialog
                open={isCreate || isEdit}
                onClose={closeDialog}
                onSubmit={async (formData) => {
                    if (isCreate) {
                        await handleCreate(formData)
                    } else {
                        const id = selectedTemplate?._id || selectedTemplate?.id
                        if (!id) return
                        await handleUpdate(id, formData)
                    }
                    closeDialog()
                }}
                editingTemplate={isEdit ? selectedTemplate : null}
                loading={crudLoading}
            />
        </MuiBox>
    )
}

