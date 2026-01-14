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
import { LoadingScreen, EmptyState, SEOHead, DataTable, ConfirmDialog } from '@/components/common'

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
    MapPin
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
                                src={row.imageUrl.startsWith('http') ? row.imageUrl : `http://82.137.244.167:5001${row.imageUrl}`} 
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
                            {row.hallId?.name || '—'}
                        </MuiTypography>
                    </MuiBox>
                </MuiBox>
            )
        },
        {
            id: 'hallId',
            label: 'قاعة/صالة',
            align: 'right',
            format: (value) => (
                <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Building2 size={16} style={{ color: 'var(--color-primary-400)' }} />
                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                            {value?.name || 'قاعة/صالة غير محددة'}
                        </MuiTypography>
                    </MuiBox>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MapPin size={14} style={{ color: 'var(--color-primary-300)' }} />
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                            {value?.location || '—'}
                        </MuiTypography>
                    </MuiBox>
                </MuiBox>
            )
        },
        {
            id: 'capacity',
            label: 'السعة',
            align: 'center',
            format: (value, row) => (
                <MuiBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Users size={16} style={{ color: 'var(--color-primary-400)' }} />
                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                            {row.hallId?.capacity || value || '—'}
                        </MuiTypography>
                    </MuiBox>
                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                        {row.hallId?.tables ? `${row.hallId.tables} طاولة` : ''}
                        {row.hallId?.tables && row.hallId?.chairs ? ' • ' : ''}
                        {row.hallId?.chairs ? `${row.hallId?.chairs} كرسي` : ''}
                    </MuiTypography>
                </MuiBox>
            )
        },
        {
            id: 'price',
            label: 'السعر',
            align: 'center',
            format: (value, row) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                    <DollarSign size={16} style={{ color: 'var(--color-primary-400)' }} />
                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                        {row.hallId?.defaultPrices ? `${row.hallId.defaultPrices} ريال` : '—'}
                    </MuiTypography>
                </MuiBox>
            )
        },
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
                            <ImageIcon size={28} className="text-white" />
                        </MuiBox>
                        <MuiBox>
                            <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700, mb: 0.5 }}>
                                إدارة القوالب ({filteredTemplates.length})
                            </MuiTypography>
                            <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                                إدارة قوالب بطاقات الدعوة والمستندات الرسمية المتاحة في النظام
                            </MuiTypography>
                        </MuiBox>
                    </MuiBox>

                    <MuiButton
                        variant="contained"
                        startIcon={<Upload size={20} />}
                        onClick={handleCreateClick}
                        sx={{
                            background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-800))',
                            color: '#fff',
                            fontWeight: 600,
                            px: 3,
                            py: 1,
                            borderRadius: '12px',
                            '&:hover': {
                                background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-900))',
                                boxShadow: '0 4px 15px rgba(216, 185, 138, 0.4)'
                            }
                        }}
                    >
                        رفع قالب جديد
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
                            background: 'linear-gradient(135deg, rgba(216, 185, 138, 0.1), rgba(216, 185, 138, 0.05))',
                            border: '1px solid rgba(216, 185, 138, 0.2)',
                            borderRadius: '16px',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: -20,
                                right: -20,
                                width: 80,
                                height: 80,
                                background: 'rgba(216, 185, 138, 0.1)',
                                borderRadius: '50%'
                            }
                        }}
                    >
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <MuiBox>
                                <MuiTypography variant="h4" sx={{ color: 'var(--color-primary-400)', fontWeight: 700, mb: 0.5 }}>
                                    {filteredTemplates.length}
                                </MuiTypography>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                    عدد القوالب
                                </MuiTypography>
                            </MuiBox>
                            <MuiBox
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '12px',
                                    background: 'rgba(216, 185, 138, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <ImageIcon size={24} style={{ color: '#D8B98A' }} />
                            </MuiBox>
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>

                <MuiGrid item xs={12} sm={6} md={3}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            p: 3,
                            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))',
                            border: '1px solid rgba(34, 197, 94, 0.2)',
                            borderRadius: '16px',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: -20,
                                right: -20,
                                width: 80,
                                height: 80,
                                background: 'rgba(34, 197, 94, 0.1)',
                                borderRadius: '50%'
                            }
                        }}
                    >
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <MuiBox>
                                <MuiTypography variant="h4" sx={{ color: '#22c55e', fontWeight: 700, mb: 0.5 }}>
                                    {filteredTemplates.filter(t => t.isActive !== false).length}
                                </MuiTypography>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                    قوالب نشطة
                                </MuiTypography>
                            </MuiBox>
                            <MuiBox
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '12px',
                                    background: 'rgba(34, 197, 94, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <CheckCircle size={24} style={{ color: '#22c55e' }} />
                            </MuiBox>
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>

                <MuiGrid item xs={12} sm={6} md={3}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            p: 3,
                            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '16px',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: -20,
                                right: -20,
                                width: 80,
                                height: 80,
                                background: 'rgba(239, 68, 68, 0.1)',
                                borderRadius: '50%'
                            }
                        }}
                    >
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <MuiBox>
                                <MuiTypography variant="h4" sx={{ color: '#ef4444', fontWeight: 700, mb: 0.5 }}>
                                    {filteredTemplates.filter(t => t.isActive === false).length}
                                </MuiTypography>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                    قوالب معطلة
                                </MuiTypography>
                            </MuiBox>
                            <MuiBox
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '12px',
                                    background: 'rgba(239, 68, 68, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <XCircle size={24} style={{ color: '#ef4444' }} />
                            </MuiBox>
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>

                <MuiGrid item xs={12} sm={6} md={3}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            p: 3,
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            borderRadius: '16px',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: -20,
                                right: -20,
                                width: 80,
                                height: 80,
                                background: 'rgba(59, 130, 246, 0.1)',
                                borderRadius: '50%'
                            }
                        }}
                    >
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <MuiBox>
                                <MuiTypography variant="h4" sx={{ color: '#3b82f6', fontWeight: 700, mb: 0.5 }}>
                                    {[...new Set(filteredTemplates.map(t => t.category).filter(Boolean))].length}
                                </MuiTypography>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                    الفئات
                                </MuiTypography>
                            </MuiBox>
                            <MuiBox
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '12px',
                                    background: 'rgba(59, 130, 246, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Filter size={24} style={{ color: '#3b82f6' }} />
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
                            placeholder="البحث باسم القالب أو الفئة..."
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
                    <MuiGrid item xs={12} md={3}>
                        <MuiButton
                            fullWidth
                            variant="outlined"
                            startIcon={<Download size={20} />}
                            onClick={handleExport}
                            color="info"
                            disabled={filteredTemplates.length === 0}
                        >
                            تصدير
                        </MuiButton>
                    </MuiGrid>
                    <MuiGrid item xs={12} md={3}>
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
                            تحديث البيانات
                        </MuiButton>
                    </MuiGrid>
                </MuiGrid>
            </MuiPaper>

            {/* Templates Grid/Table */}
            <DataTable
                columns={columns}
                rows={filteredTemplates}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
                onView={openViewDialog}
                loading={isLoading}
                emptyMessage="لا توجد قوالب متاحة"
                showActions={true}
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

