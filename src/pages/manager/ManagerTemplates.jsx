// src\pages\manager\ManagerTemplates.jsx
/**
 * Manager Templates Page
 * إدارة قوالب الدعوات
 */

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce, useDialogState, useCRUD } from '@/hooks'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiButton from '@/components/ui/MuiButton'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiInputAdornment from '@/components/ui/MuiInputAdornment'
import MuiChip from '@/components/ui/MuiChip'
import {
    LoadingScreen,
    SEOHead,
    ConfirmDialog,
    DataTable,
} from '@/components/common'
import { QUERY_KEYS } from '@/config/constants'
import {
    listManagerTemplates,
    addManagerTemplate,
    editManagerTemplate,
    deleteManagerTemplate,
} from '@/api/manager'
import { Plus, Search, Image as ImageIcon, RefreshCw, Calendar, Tag, Hash, Clock } from 'lucide-react'
import { formatDate } from '@/utils/helpers'
import CreateEditTemplateDialog from './components/CreateEditTemplateDialog'
import ViewTemplateDialog from './components/ViewTemplateDialog'

export default function ManagerTemplates() {
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 500)

    // Dialog state management
    const {
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

    // CRUD operations - Note: Templates use FormData, so we need custom handlers
    const {
        handleCreate,
        handleUpdate,
        handleDelete,
        isLoading: crudLoading,
    } = useCRUD({
        createFn: addManagerTemplate,
        updateFn: editManagerTemplate,
        deleteFn: deleteManagerTemplate,
        queryKey: QUERY_KEYS.MANAGER_TEMPLATES,
        successMessage: 'تمت العملية بنجاح',
        errorMessage: 'حدث خطأ أثناء العملية',
    })

    // Fetch templates
    const { data: templatesData, isLoading, refetch } = useQuery({
        queryKey: QUERY_KEYS.MANAGER_TEMPLATES,
        queryFn: listManagerTemplates,
    })

    // Memoize templates to avoid dependency issues
    const templates = useMemo(() => {
        return templatesData?.templates || templatesData?.data || templatesData || []
    }, [templatesData])

    // Filtered Templates
    const filteredTemplates = useMemo(() => {
        let filtered = Array.isArray(templates) ? templates : []

        if (debouncedSearch) {
            filtered = filtered.filter(template =>
                template.templateName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
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
                                src={row.imageUrl.startsWith('http') ? row.imageUrl : `http://82.137.244.167:5001/${row.imageUrl.startsWith('/') ? row.imageUrl.slice(1) : row.imageUrl}`} 
                                alt={value} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                onError={() => {
                                    // Image failed to load
                                }}
                            />
                        ) : (
                            <ImageIcon size={24} style={{ color: 'var(--color-primary-500)' }} />
                        )}
                    </MuiBox>
                    <MuiBox>
                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                            {value || 'بدون اسم'}
                        </MuiTypography>
                    </MuiBox>
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
                        {formatDate(value, 'MM/DD/YYYY')}
                    </MuiTypography>
                </MuiBox>
            )
        },
        {
            id: 'updatedAt',
            label: 'آخر تحديث',
            align: 'center',
            format: (value) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                    <Clock size={16} style={{ color: 'var(--color-primary-400)' }} />
                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                        {formatDate(value, 'MM/DD/YYYY')}
                    </MuiTypography>
                </MuiBox>
            )
        }
    ]

    // Event Handlers
    const handleRefresh = () => {
        refetch()
    }

    // Submit Handlers
    const handleSaveSubmit = async (formData) => {
        if (isEdit && selectedTemplate) {
            const result = await handleUpdate(selectedTemplate._id, formData)
            if (result.success) {
                closeDialog()
            }
        } else {
            const result = await handleCreate(formData)
            if (result.success) {
                closeDialog()
            }
        }
    }

    const handleDeleteConfirm = async () => {
        const id = selectedTemplate?._id || selectedTemplate?.id
        if (!id) {
            return
        }
        
        // Ensure ID is a string
        const templateId = String(id).trim()
        if (!templateId) {
            return
        }
        
        const result = await handleDelete(templateId)
        if (result.success) {
            closeDialog()
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
                            <ImageIcon size={28} style={{ color: '#fff' }} />
                        </MuiBox>
                        <MuiBox>
                            <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700, mb: 0.5 }}>
                                إدارة القوالب ({filteredTemplates.length})
                            </MuiTypography>
                            <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                                إدارة قوالب بطاقات الدعوة الخاصة بالصالة
                            </MuiTypography>
                        </MuiBox>
                    </MuiBox>

                    <MuiButton
                        variant="contained"
                        startIcon={<Plus size={20} />}
                        onClick={openCreateDialog}
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
                        إضافة قالب جديد
                    </MuiButton>
                </MuiBox>
            </MuiBox>

            {/* Stats Cards */}
            <MuiGrid container spacing={3} sx={{ mb: 4 }}>
                <MuiGrid item xs={12} sm={6} md={4}>
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
                    <MuiGrid item xs={12} md={10}>
                        <MuiTextField
                            fullWidth
                            placeholder="البحث باسم القالب..."
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

            {/* Templates Table */}
            <DataTable
                columns={columns}
                rows={filteredTemplates}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
                onView={openViewDialog}
                loading={isLoading}
                emptyMessage="لا توجد قوالب"
            />

            {/* Create/Edit Dialog */}
            <CreateEditTemplateDialog
                open={isCreate || isEdit}
                onClose={closeDialog}
                onSubmit={handleSaveSubmit}
                editingTemplate={isEdit ? selectedTemplate : null}
                loading={crudLoading}
            />

            {/* View Dialog */}
            <ViewTemplateDialog
                open={isView}
                onClose={closeDialog}
                template={selectedTemplate}
            />

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={isDelete}
                onClose={closeDialog}
                onConfirm={handleDeleteConfirm}
                title="تأكيد الحذف"
                message={`هل أنت متأكد من حذف القالب "${selectedTemplate?.templateName || 'هذا القالب'}"؟`}
                confirmText="حذف"
                cancelText="إلغاء"
                loading={crudLoading}
            />
        </MuiBox>
    )
}
