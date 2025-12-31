// src\pages\manager\components\CreateEditStaffDialog.jsx
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiTypography from '@/components/ui/MuiTypography'
import { BaseFormDialog, FormField } from '@/components/shared'
import { useNotification } from '@/hooks'
import { createStaffSchema } from '@/utils/validations'

export default function CreateEditStaffDialog({ open, onClose, onSubmit, editingStaff, loading }) {
    const { addNotification: showNotification } = useNotification()

    const isEdit = !!editingStaff
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(createStaffSchema(isEdit, ['scanner'])),
        defaultValues: {
            name: editingStaff?.name || '',
            phone: editingStaff?.phone || '',
            username: editingStaff?.username || '',
            role: editingStaff?.role || editingStaff?.position || 'scanner',
            password: ''
        }
    })

    useEffect(() => {
        if (open) {
            if (editingStaff) {
                reset({
                    name: editingStaff.name,
                    phone: editingStaff.phone,
                    username: editingStaff.username || '',
                    role: editingStaff.role || editingStaff.position || 'scanner',
                    password: '' // Don't pre-fill password for security
                })
            } else {
                reset({
                    name: '',
                    phone: '',
                    username: '',
                    role: 'scanner',
                    password: ''
                })
            }
        }
    }, [open, editingStaff, reset])

    const handleFormSubmit = (data) => {
        // Prepare data for API - role is always 'scanner'
        const submitData = {
            name: data.name,
            phone: data.phone,
            username: data.username,
            role: 'scanner', // Always scanner - no user selection
            password: data.password
        }
        
        // Remove empty fields when editing (if user didn't want to change them)
        if (editingStaff) {
            if (!submitData.password || submitData.password.trim() === '') {
                delete submitData.password
            }
            if (!submitData.username || submitData.username.trim() === '') {
                delete submitData.username
            }
        }
        
        onSubmit(submitData)
    }

    return (
        <BaseFormDialog
            open={open}
            onClose={onClose}
            title={isEdit ? 'تعديل الموظف' : 'إضافة موظف جديد'}
            onSubmit={handleSubmit(handleFormSubmit, (errors) => {
                const firstError = Object.values(errors)[0]
                showNotification({
                    title: 'بيانات غير مكتملة',
                    message: firstError?.message || 'يرجى التحقق من الحقول المطلوبة',
                    type: 'error'
                })
            })}
            loading={loading}
            submitText={isEdit ? 'تحديث' : 'إضافة'}
            cancelText="إلغاء"
            maxWidth="sm"
        >
            <MuiGrid container spacing={3}>
                {/* Basic Info */}
                <MuiGrid item xs={12}>
                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'var(--color-primary-500)' }}>
                        المعلومات الأساسية
                    </MuiTypography>
                </MuiGrid>

                <FormField
                    name="name"
                    control={control}
                    label="اسم الموظف"
                    errors={errors}
                    required
                    fullWidth
                    gridItemProps={{ xs: 12 }}
                />

                <FormField
                    name="phone"
                    control={control}
                    label="رقم الهاتف"
                    errors={errors}
                    required
                    fullWidth
                    gridItemProps={{ xs: 12 }}
                />

                <FormField
                    name="username"
                    control={control}
                    label="اسم المستخدم"
                    errors={errors}
                    required={!isEdit}
                    fullWidth
                    helperText={isEdit ? 'اتركه فارغاً إذا لم ترد تغييره' : ''}
                    gridItemProps={{ xs: 12 }}
                />

                <FormField
                    name="password"
                    control={control}
                    label={isEdit ? 'كلمة المرور (اتركه فارغاً إذا لم ترد تغييره)' : 'كلمة المرور'}
                    errors={errors}
                    type="password"
                    required={!isEdit}
                    fullWidth
                    helperText={isEdit ? 'اتركه فارغاً إذا لم ترد تغييره' : ''}
                    gridItemProps={{ xs: 12 }}
                />
            </MuiGrid>
        </BaseFormDialog>
    )
}

