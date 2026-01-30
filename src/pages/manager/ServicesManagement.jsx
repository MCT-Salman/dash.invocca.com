// src\pages\manager\ServicesManagement.jsx
/**
 * Services Management Page for Manager
 * إدارة الخدمات للمدير
 */

import React, { useState, useMemo } from 'react'
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
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiInputAdornment from '@/components/ui/MuiInputAdornment'
import MuiIconButton from '@/components/ui/MuiIconButton'
import MuiStack from '@/components/ui/MuiStack'

// Layout & Common Components
import { LoadingScreen, EmptyState, SEOHead, DataTable, FormDialog, ConfirmDialog } from '@/components/common'
import ViewServiceDialog from '@/pages/admin/components/ViewServiceDialog'

// Hooks & Utilities
import { useNotification, useDebounce, useDialogState } from '@/hooks'
import { QUERY_KEYS, SERVICE_CATEGORY_LABELS, SERVICE_UNIT_LABELS } from '@/config/constants'
import { getHallServices, addHallService, updateHallService, deleteHallService } from '@/api/manager'
import { formatCurrency } from '@/utils/helpers'

// Icons
import {
    ClipboardList,
    Search,
    Plus,
    RefreshCw,
    CheckCircle,
    XCircle,
    Package,
    Tag,
    DollarSign,
    Trash2,
    X,
    Eye,
    Edit2
} from 'lucide-react'

// ====================== Main Component ======================
export default function ServicesManagement() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const { addNotification: showNotification } = useNotification()
    const queryClient = useQueryClient()

    // State
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 500)
    const [categoryFilter, setCategoryFilter] = useState('all')

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

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        description: '',
        unit: 'per_event'
    })

    // Fetch hall services
    const { data: servicesData, isLoading, refetch } = useQuery({
        queryKey: ['manager', 'hall-services'],
        queryFn: getHallServices,
        staleTime: 5 * 60 * 1000
    })

    const services = Array.isArray(servicesData?.services) 
        ? servicesData.services 
        : Array.isArray(servicesData?.data) 
            ? servicesData.data 
            : Array.isArray(servicesData) 
                ? servicesData 
                : []

    // Filtered Services
    const filteredServices = useMemo(() => {
        let filtered = services

        // Apply search filter
        if (debouncedSearch) {
            filtered = filtered.filter(service =>
                service.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                service.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
            )
        }

        // Apply category filter
        if (categoryFilter && categoryFilter !== 'all') {
            filtered = filtered.filter(service => service.category === categoryFilter)
        }

        return filtered
    }, [services, debouncedSearch, categoryFilter])

    // Mutations
    const createMutation = useMutation({
        mutationFn: (data) => addHallService(data),
        onSuccess: () => {
            showNotification({
                title: 'نجاح',
                message: 'تم إضافة الخدمة بنجاح',
                type: 'success'
            })
            queryClient.invalidateQueries({ queryKey: ['manager', 'hall-services'] })
            closeDialog()
        },
        onError: (error) => {
            showNotification({
                title: 'خطأ',
                message: error?.response?.data?.message || 'فشل في إضافة الخدمة',
                type: 'error'
            })
        }
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateHallService(id, data),
        onSuccess: () => {
            showNotification({
                title: 'نجاح',
                message: 'تم تحديث الخدمة بنجاح',
                type: 'success'
            })
            queryClient.invalidateQueries({ queryKey: ['manager', 'hall-services'] })
            closeDialog()
        },
        onError: (error) => {
            showNotification({
                title: 'خطأ',
                message: error?.response?.data?.message || 'فشل في تحديث الخدمة',
                type: 'error'
            })
        }
    })

    const deleteMutation = useMutation({
        mutationFn: (serviceId) => deleteHallService(serviceId),
        onSuccess: () => {
            showNotification({
                title: 'نجاح',
                message: 'تم حذف الخدمة بنجاح',
                type: 'success'
            })
            queryClient.invalidateQueries({ queryKey: ['manager', 'hall-services'] })
            closeDialog()
        },
        onError: (error) => {
            showNotification({
                title: 'خطأ',
                message: error?.response?.data?.message || 'فشل في حذف الخدمة',
                type: 'error'
            })
        }
    })

    // Table Columns
    const columns = [
        {
            id: 'name',
            label: 'اسم الخدمة',
            align: 'right',
            format: (value, row) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MuiBox
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '8px',
                            background: 'rgba(216, 185, 138, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(216, 185, 138, 0.2)',
                        }}
                    >
                        <Package size={20} style={{ color: '#D8B98A' }} />
                    </MuiBox>
                    <MuiBox>
                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                            {value}
                        </MuiTypography>
                        {row.description && (
                            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                {row.description.substring(0, 50)}...
                            </MuiTypography>
                        )}
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
                    label={SERVICE_CATEGORY_LABELS[value] || value || '—'}
                    size="small"
                    sx={{
                        backgroundColor: 'rgba(216, 185, 138, 0.1)',
                        color: 'var(--color-primary-400)',
                        fontWeight: 600,
                    }}
                />
            )
        },
        {
            id: 'price',
            label: 'السعر',
            align: 'center',
            format: (value, row) => {
                const price = value || row.basePrice || 0
                return (
                    <MuiTypography variant="body2" component="span" sx={{ color: 'var(--color-primary-400)', fontWeight: 700 }}>
                        {formatCurrency(price)}
                    </MuiTypography>
                )
            }
        },
        {
            id: 'unit',
            label: 'وحدة القياس',
            align: 'center',
            format: (value) => (
                <MuiChip
                    label={SERVICE_UNIT_LABELS[value] || value || '—'}
                    size="small"
                    sx={{
                        backgroundColor: 'rgba(216, 185, 138, 0.1)',
                        color: 'var(--color-primary-400)',
                        fontWeight: 600,
                    }}
                />
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
                    }}
                    icon={value ? <CheckCircle size={14} /> : <XCircle size={14} />}
                />
            )
        }
    ]

    const handleSubmit = async (e) => {
        e?.preventDefault?.()
        const id = selectedService?._id || selectedService?.id
        
        const submitData = {
            name: formData.name,
            category: formData.category,
            price: Number(formData.price) || 0,
            description: formData.description || '',
            unit: formData.unit || 'per_event'
        }

        try {
            if (isEdit && id) {
                await updateMutation.mutateAsync({ id, data: submitData })
            } else {
                await createMutation.mutateAsync(submitData)
            }
        } catch (error) {
            // Error handled by mutation
        }
    }

    const handleEditClick = (service) => {
        openEditDialog(service)
        setFormData({
            name: service.name || '',
            category: service.category || '',
            price: service.price || service.basePrice || '',
            description: service.description || '',
            unit: service.unit || 'per_event'
        })
    }

    const handleCreateClick = () => {
        openCreateDialog()
        setFormData({
            name: '',
            category: '',
            price: '',
            description: '',
            unit: 'per_event'
        })
    }

    const handleDeleteConfirm = async () => {
        const id = selectedService?._id || selectedService?.id
        if (!id) return
        await deleteMutation.mutateAsync(id)
    }

    const handleRefresh = () => {
        refetch()
        showNotification({ title: 'تحديث', message: 'تم تحديث البيانات بنجاح', type: 'success' })
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
                    background: 'var(--color-paper)',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border-glass)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}
            >
                <MuiBox sx={{ position: 'relative', zIndex: 1 }}>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
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
                                <Package size={28} className="text-white" />
                            </MuiBox>
                            <MuiBox>
                                <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary)', fontWeight: 700, mb: 0.5 }}>
                                    إدارة الخدمات ({filteredServices.length})
                                </MuiTypography>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-300)' }}>
                                    إدارة خدمات قاعة/صالة
                                </MuiTypography>
                            </MuiBox>
                        </MuiBox>
                        <MuiStack direction="row" spacing={2}>
                            <MuiButton
                                variant="outlined"
                                startIcon={<RefreshCw size={18} />}
                                onClick={handleRefresh}
                            >
                                تحديث
                            </MuiButton>
                            <MuiButton
                                variant="contained"
                                startIcon={<Plus size={18} />}
                                onClick={handleCreateClick}
                            >
                                إضافة خدمة
                            </MuiButton>
                        </MuiStack>
                    </MuiBox>
                </MuiBox>
            </MuiBox>

            {/* Filters */}
            <MuiPaper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 3,
                    background: 'var(--color-paper)',
                    border: '1px solid var(--color-border-glass)',
                    borderRadius: '16px',
                }}
            >
                <MuiGrid container spacing={2}>
                    <MuiGrid item xs={12} md={6}>
                        <MuiTextField
                            fullWidth
                            placeholder="ابحث عن خدمة..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <MuiInputAdornment position="start">
                                        <Search size={20} style={{ color: 'var(--color-text-secondary)' }} />
                                    </MuiInputAdornment>
                                ),
                            }}
                        />
                    </MuiGrid>
                    <MuiGrid item xs={12} md={6}>
                        <MuiSelect
                            fullWidth
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <MuiMenuItem value="all">جميع الفئات</MuiMenuItem>
                            {Object.entries(SERVICE_CATEGORY_LABELS).map(([key, label]) => (
                                <MuiMenuItem key={key} value={key}>{label}</MuiMenuItem>
                            ))}
                        </MuiSelect>
                    </MuiGrid>
                </MuiGrid>
            </MuiPaper>

            {/* Services Table */}
            {filteredServices.length > 0 ? (
                <DataTable
                    data={filteredServices}
                    columns={columns}
                    onView={(row) => openViewDialog(row)}
                    onEdit={(row) => handleEditClick(row)}
                    onDelete={(row) => openDeleteDialog(row)}
                    loading={createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
                />
            ) : (
                <EmptyState
                    title="لا توجد خدمات"
                    description={searchTerm || categoryFilter !== 'all' ? 'لم يتم العثور على خدمات تطابق البحث' : 'لم يتم إضافة أي خدمات بعد'}
                    icon={Package}
                />
            )}

            {/* Create/Edit Dialog */}
            <FormDialog
                open={isCreate || isEdit}
                onClose={closeDialog}
                title={isEdit ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
                onSubmit={handleSubmit}
                loading={createMutation.isPending || updateMutation.isPending}
                submitText={isEdit ? 'تحديث' : 'إضافة'}
                cancelText="إلغاء"
                maxWidth="md"
            >
                <MuiGrid container spacing={3}>
                    <MuiGrid item xs={12} md={6}>
                        <MuiTextField
                            fullWidth
                            label="اسم الخدمة"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </MuiGrid>
                    <MuiGrid item xs={12} md={6}>
                        <MuiSelect
                            fullWidth
                            label="الفئة"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                        >
                            <MuiMenuItem value="">اختر الفئة</MuiMenuItem>
                            {Object.entries(SERVICE_CATEGORY_LABELS).map(([key, label]) => (
                                <MuiMenuItem key={key} value={key}>{label}</MuiMenuItem>
                            ))}
                        </MuiSelect>
                    </MuiGrid>
                    <MuiGrid item xs={12} md={6}>
                        <MuiTextField
                            fullWidth
                            label="السعر"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                            InputProps={{
                                endAdornment: <span style={{ color: 'var(--color-text-secondary)' }}>ل.س</span>
                            }}
                        />
                    </MuiGrid>
                    <MuiGrid item xs={12} md={6}>
                        <MuiSelect
                            fullWidth
                            label="وحدة القياس"
                            value={formData.unit}
                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                            required
                        >
                            {Object.entries(SERVICE_UNIT_LABELS).map(([key, label]) => (
                                <MuiMenuItem key={key} value={key}>{label}</MuiMenuItem>
                            ))}
                        </MuiSelect>
                    </MuiGrid>
                    <MuiGrid item xs={12}>
                        <MuiTextField
                            fullWidth
                            label="الوصف"
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </MuiGrid>
                </MuiGrid>
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
                title="تأكيد الحذف"
                message={`هل أنت متأكد من حذف الخدمة "${selectedService?.name || 'هذه الخدمة'}"؟`}
                confirmText="حذف"
                cancelText="إلغاء"
                loading={deleteMutation.isPending}
                confirmColor="error"
            />
        </MuiBox>
    )
}

