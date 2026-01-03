// src\pages\manager\components\CreateEditClientDialog.jsx
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiTextField from '@/components/ui/MuiTextField'
import { BaseFormDialog } from '@/components/shared'
import { useNotification } from '@/hooks'
import { createUserSchema } from '@/utils/validations'

export default function CreateEditClientDialog({ open, onClose, onSubmit, editingClient, loading }) {
    const { addNotification: showNotification } = useNotification()

    const isEdit = !!editingClient
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(createUserSchema(isEdit)),
        defaultValues: {
            name: editingClient?.name || '',
            username: editingClient?.username || '',
            phone: editingClient?.phone || '',
            password: ''
        }
    })

    useEffect(() => {
        if (open) {
            if (editingClient) {
                reset({
                    name: editingClient.name,
                    username: editingClient.username || '',
                    phone: editingClient.phone,
                    password: '' // Don't pre-fill password for security
                })
            } else {
                reset({
                    name: '',
                    username: '',
                    phone: '',
                    password: ''
                })
            }
        }
    }, [open, editingClient, reset])

    const handleFormSubmit = (data) => {
        // Remove empty password/username when editing (if user didn't want to change them)
        const submitData = { ...data }
        if (editingClient) {
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
            title={isEdit ? 'تعديل العميل' : 'إضافة عميل جديد'}
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
                                label="اسم العميل"
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
                                helperText={error?.message}
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
                                helperText={error?.message || (!isEdit ? 'يجب أن تحتوي على حرف كبير وصغير ورقم' : '')}
                            />
                        )}
                    />
                    {!isEdit && (
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', mt: 0.5, display: 'block', fontSize: '0.75rem' }}>
                            يجب أن تحتوي كلمة المرور على حرف كبير (A-Z) وحرف صغير (a-z) ورقم (0-9) على الأقل
                        </MuiTypography>
                    )}
                </MuiGrid>
            </MuiGrid>
        </BaseFormDialog>
    )
}

