// src\pages\manager\components\CreateEditStaffDialog.jsx
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiTextField from '@/components/ui/MuiTextField'
import { BaseFormDialog } from '@/components/shared'
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

                <MuiGrid item xs={12}>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <MuiTextField
                                {...field}
                                label="اسم الموظف"
                                required
                                fullWidth
                                error={!!error}
                                helperText={error?.message}
                            />
                        )}
                    />
                </MuiGrid>

                <MuiGrid item xs={12}>
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <MuiTextField
                                {...field}
                                label="رقم الهاتف"
                                type="tel"
                                required
                                fullWidth
                                error={!!error}
                                helperText={error?.message}
                                inputMode="tel"
                            />
                        )}
                    />
                </MuiGrid>

                <MuiGrid item xs={12}>
                    <Controller
                        name="username"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <MuiTextField
                                {...field}
                                label="اسم المستخدم"
                                required={!isEdit}
                                fullWidth
                                placeholder={isEdit ? 'اتركه فارغاً إذا لم ترد تغييره' : ''}
                                error={!!error}
                                helperText={error?.message || (isEdit ? 'اتركه فارغاً إذا لم ترد تغييره' : '')}
                            />
                        )}
                    />
                </MuiGrid>

                <MuiGrid item xs={12}>
                    <Controller
                        name="password"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <MuiTextField
                                {...field}
                                label={isEdit ? 'كلمة المرور (اتركه فارغاً إذا لم ترد تغييره)' : 'كلمة المرور'}
                                type="password"
                                required={!isEdit}
                                fullWidth
                                placeholder={!isEdit ? 'يجب أن تحتوي على حرف كبير وصغير ورقم' : ''}
                                error={!!error}
                                helperText={error?.message || (isEdit ? 'اتركه فارغاً إذا لم ترد تغييره' : 'يجب أن تحتوي على حرف كبير وصغير ورقم')}
                            />
                        )}
                    />
                </MuiGrid>
            </MuiGrid>
        </BaseFormDialog>
    )
}

