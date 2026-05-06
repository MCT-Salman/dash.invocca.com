import { useState, useMemo } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useTheme, useMediaQuery } from '@mui/material'
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
import MuiIconButton from '@/components/ui/MuiIconButton'

// Layout & Common Components
import { LoadingScreen, EmptyState, SEOHead, ConfirmDialog, CrudPageLayout, StatusBadge } from '@/components/common'

// Dialog Components
import ViewTemplateDialog from './components/ViewTemplateDialog'
import CreateEditTemplateDialog from './components/CreateEditTemplateDialog'

// Hooks & Utilities
import { useDebounce, useDialogState, useCRUD, useNotification } from '@/hooks'
import { QUERY_KEYS } from '@/config/constants'
import { getTemplates, createTemplate, updateTemplate, deleteTemplate, toggleTemplateStatus } from '@/api/admin'
import { formatDate } from '@/utils/helpers'

// Icons
import {
    Image as ImageIcon,
    Search,
    Plus,
    RefreshCw,
    CheckCircle,
    XCircle,
    FileText,
    Eye,
    Trash2,
    Edit2,
    Filter,
    X,
    Package,
    Tag,
    DollarSign,
    Calendar,
    Building2
} from 'lucide-react'

// ====================== Main Component ======================
export default function TemplatesManagement() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const { addNotification: showNotification } = useNotification()

    // State
    const [searchQuery, setSearchQuery] = useState('')
    const [activeFilters, setActiveFilters] = useState({})
    const debouncedSearch = useDebounce(searchQuery, 500)
    const [viewMode, setViewMode] = useState('table') // 'card' or 'table'
    const [rowsPerPage, setRowsPerPage] = useState(10)

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

    // Toggle status mutation
    const toggleStatusMutation = useMutation({
        mutationFn: ({ id, isActive }) => toggleTemplateStatus(id, isActive),
        onSuccess: (data) => {
            refetch()
            showNotification({
                title: 'تم',
                message: data?.message || 'تم تغيير حالة القالب بنجاح',
                type: 'success'
            })
        },
        onError: (error) => {
            showNotification({
                title: 'خطأ',
                message: error?.response?.data?.message || 'حدث خطأ أثناء تغيير الحالة',
                type: 'error'
            })
        }
    })

    const handleToggleStatus = async (template) => {
        const id = template?._id || template?.id
        if (!id) return
        await toggleStatusMutation.mutateAsync({ id, isActive: !template.isActive })
    }

    // Fetch Templates
    const { data: templatesData, isLoading, refetch } = useQuery({
        queryKey: QUERY_KEYS.ADMIN_TEMPLATES,
        queryFn: getTemplates,
    })

    const templates = templatesData?.templates || templatesData?.data || templatesData || []

    // Category translation mapping
    const categoryTranslations = {
        'wedding': 'زفاف',
        'birthday': 'عيد ميلاد',
        'other': 'عام',
        'engagement': 'خطوبة',
        'graduation': 'تخرج',
        'corporate': 'شركات',
        'anniversary': 'ذكرى سنوية'
    }

    // Get unique categories for filter
    const uniqueCategories = useMemo(() => {
        const categories = templates.map(t => t.category).filter(Boolean)
        return [...new Set(categories)]
    }, [templates])

    // Filter configuration for AdvancedFilter
    const filterConfig = useMemo(() => {
        const categoryOptions = uniqueCategories.map(cat => ({
            value: cat,
            label: categoryTranslations[cat] || cat
        }))
        return [
            {
                key: 'category',
                label: 'الفئة',
                type: 'select',
                options: categoryOptions
            },
            {
                key: 'status',
                label: 'الحالة',
                type: 'select',
                options: [
                    { value: 'active', label: 'مفعّل' },
                    { value: 'inactive', label: 'معطّل' }
                ]
            },
            {
                key: 'createdAt',
                label: 'تاريخ الإنشاء',
                type: 'dateRange'
            }
        ]
    }, [uniqueCategories])

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

        // Apply category filter
        if (activeFilters.category) {
            filtered = filtered.filter(template => template.category === activeFilters.category)
        }

        // Apply status filter
        if (activeFilters.status) {
            filtered = filtered.filter(template => {
                if (activeFilters.status === 'active') return template.isActive === true
                if (activeFilters.status === 'inactive') return template.isActive === false
                return true
            })
        }

        // Apply date range filter
        if (activeFilters.dateFrom || activeFilters.dateTo) {
            filtered = filtered.filter(template => {
                if (!template.createdAt) return false
                const templateDate = new Date(template.createdAt)
                const fromDate = activeFilters.dateFrom ? new Date(activeFilters.dateFrom) : null
                const toDate = activeFilters.dateTo ? new Date(activeFilters.dateTo) : null

                // Set toDate to end of day to include the selected date
                if (toDate) {
                    toDate.setHours(23, 59, 59, 999)
                }

                if (fromDate && templateDate < fromDate) return false
                if (toDate && templateDate > toDate) return false

                return true
            })
        }

        return filtered
    }, [templates, debouncedSearch, activeFilters])

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
                            background: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--color-border)',
                        }}
                    >
                        {row.imageUrl ? (
                            <img
                                src={row.imageUrl.startsWith('http') ? row.imageUrl : `${import.meta.env.VITE_API_BASE}${row.imageUrl}`}
                                alt={value}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <ImageIcon size={24} style={{ color: 'var(--color-icon)' }} />
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
            id: 'isActive',
            label: 'الحالة',
            align: 'center',
            format: (value, row) => (
                <StatusBadge value={value} activeLabel="مفعّل" inactiveLabel="معطّل" />
            )
        },
        {
            id: 'hallsCount',
            label: 'عدد القاعات',
            align: 'center',
            format: (value, row) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MuiChip
                        label={value || 0}
                        size="small"
                        icon={<Building2 size={14} />}
                        sx={{
                            backgroundColor: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
                            color: 'var(--color-icon)',
                            fontWeight: 600,
                            borderRadius: '8px'
                        }}
                    />
                </MuiBox>
            )
        },
        {
            id: 'createdAt',
            label: 'تاريخ الإنشاء',
            align: 'center',
            format: (value) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                    <Calendar size={16} style={{ color: 'var(--color-icon)'}} />
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
                        borderColor: 'var(--color-icon)',
                    }
                }}
            >
                <MuiBox sx={{ position: 'relative', height: 200, background: 'color-mix(in srgb, var(--color-gold) 10%, transparent)' }}>
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
                            <ImageIcon size={48} style={{ color: 'var(--color-icon)'}} />
                        </MuiBox>
                    )}
                    <MuiChip
                        label={categoryTranslations[template.category] || template.category || 'عام'}
                        size="small"
                        sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 700, background: 'color-mix(in srgb, var(--color-light) 90%, transparent)', backdropFilter: 'blur(4px)' }}
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
                        <Calendar size={14} style={{ color: 'var(--color-icon)'}} />
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

    if (isLoading) return <LoadingScreen message="جاري تحميل القوالب..." />

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
            <SEOHead title="إدارة القوالب | INVOCCA" />

            {/* CrudPageLayout - مكون موحد للتخطيط */}
            <CrudPageLayout
                stats={[
                    {
                        title: "عدد القوالب",
                        value: filteredTemplates.length,
                        icon: <ImageIcon size={24} />
                    },
                    {
                        title: "القوالب المفعّلة",
                        value: filteredTemplates.filter(t => t.isActive).length,
                        icon: <CheckCircle size={24} />
                    },
                    {
                        title: "القوالب المعطّلة",
                        value: filteredTemplates.filter(t => !t.isActive).length,
                        icon: <XCircle size={24} />
                    }
                ]}
                filterConfig={filterConfig}
                onSearch={setSearchQuery}
                onFilterChange={setActiveFilters}
                onRefresh={refetch}
                searchPlaceholder="بحث..."
                columns={columns}
                data={filteredTemplates}
                loading={isLoading}
                emptyMessage="لا توجد قوالب متاحة"
                addButtonLabel="رفع قالب جديد"
                onAdd={handleCreateClick}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
                onView={openViewDialog}
                onToggleStatus={handleToggleStatus}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={setRowsPerPage}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                showViewModeToggle={true}
                renderCard={renderTemplateCard}
            />

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
                        const result = await handleCreate(formData)
                        closeDialog()
                        return result
                    } else {
                        const id = selectedTemplate?._id || selectedTemplate?.id
                        if (!id) return
                        const result = await handleUpdate(id, formData)
                        closeDialog()
                        return result
                    }
                }}
                editingTemplate={isEdit ? selectedTemplate : null}
                loading={crudLoading}
            />
        </MuiBox>
    )
}

