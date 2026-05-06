// src\pages\manager\ManagerTemplates.jsx
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce, useDialogState, useCRUD } from '@/hooks'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import { LoadingScreen, SEOHead, ConfirmDialog, CrudPageLayout } from '@/components/common'
import { QUERY_KEYS } from '@/config/constants'
import { listManagerTemplates, addManagerTemplate, editManagerTemplate, deleteManagerTemplate } from '@/api/manager'
import { formatDate } from '@/utils/helpers'
import { Layout, FileText, Calendar } from 'lucide-react'
import CreateEditTemplateDialog from './components/CreateEditTemplateDialog'
import ViewTemplateDialog from './components/ViewTemplateDialog'

export default function ManagerTemplates() {
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearch = useDebounce(searchQuery, 500)
    
    const { data: templatesData, isLoading, refetch } = useQuery({
        queryKey: [QUERY_KEYS.MANAGER_TEMPLATES],
        queryFn: listManagerTemplates,
    })

    const templates = useMemo(() => templatesData?.templates || templatesData?.data || [], [templatesData])

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

    const {
        handleCreate,
        handleUpdate,
        handleDelete,
        isLoading: crudLoading,
    } = useCRUD({
        createFn: addManagerTemplate,
        updateFn: editManagerTemplate,
        deleteFn: deleteManagerTemplate,
        queryKey: [QUERY_KEYS.MANAGER_TEMPLATES],
        successMessage: 'تمت العملية بنجاح',
    })

    const filteredTemplates = useMemo(() => {
        let items = Array.isArray(templates) ? templates : []
        if (!debouncedSearch) return items
        return items.filter(t => {
            const name = t.template?.templateName || t.templateName || ''
            const type = t.type || ''
            return name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                   type.toLowerCase().includes(debouncedSearch.toLowerCase())
        })
    }, [templates, debouncedSearch])

    const columns = [
        {
            id: 'templateName',
            label: 'اسم القالب',
            align: 'right',
            format: (value, row) => {
                const name = row.template?.templateName || row.templateName || value || 'بدون اسم'
                return (
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <FileText size={18} color="var(--color-icon)" />
                        <MuiTypography variant="body2" sx={{ fontWeight: 600 }}>{name}</MuiTypography>
                    </MuiBox>
                )
            }
        },
        {
            id: 'type',
            label: 'النوع',
            align: 'center',
            format: (value) => (
                <MuiTypography variant="caption" sx={{ px: 1.5, py: 0.5, borderRadius: '10px', bgcolor: 'rgba(216, 185, 138, 0.1)', color: 'var(--color-icon)', fontWeight: 700 }}>
                    {value === 'contract' ? 'عقد' : value === 'invoice' ? 'فاتورة' : 'عام'}
                </MuiTypography>
            )
        },
        {
            id: 'updatedAt',
            label: 'تاريخ التحديث',
            align: 'center',
            format: (value) => (
                <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                    <Calendar size={14} />
                    <MuiTypography variant="caption">{formatDate(value)}</MuiTypography>
                </MuiBox>
            )
        }
    ]

    if (isLoading) return <LoadingScreen message="جاري تحميل القوالب..." />

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
            <SEOHead title="إدارة القوالب | INVOCCA" />
            
            <CrudPageLayout
                title="إدارة القوالب"
                subtitle="إدارة قوالب العقود والفواتير المخصصة"
                icon={Layout}
                stats={[{ title: 'إجمالي القوالب', value: templates.length, icon: <FileText /> }]}
                columns={columns}
                data={filteredTemplates}
                loading={isLoading}
                onSearch={setSearchQuery}
                onRefresh={refetch}
                onAdd={openCreateDialog}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
                onView={openViewDialog}
                addButtonLabel="قالب جديد"
            />

            <CreateEditTemplateDialog
                open={isCreate || isEdit}
                onClose={closeDialog}
                template={selectedTemplate}
                onSubmit={isCreate ? handleCreate : (data) => handleUpdate(selectedTemplate._id, data)}
                loading={crudLoading}
            />

            <ViewTemplateDialog
                open={isView}
                onClose={closeDialog}
                template={selectedTemplate}
            />

            <ConfirmDialog
                open={isDelete}
                onClose={closeDialog}
                onConfirm={() => handleDelete(selectedTemplate._id)}
                title="حذف القالب"
                content="هل أنت متأكد من حذف هذا القالب؟ لا يمكن التراجع عن هذه العملية."
                loading={crudLoading}
            />
        </MuiBox>
    )
}
