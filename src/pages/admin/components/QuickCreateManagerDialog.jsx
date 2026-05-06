// src\pages\admin\components\QuickCreateManagerDialog.jsx
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import { ModernDialog } from '@/components/common'
import { useNotification } from '@/hooks'

// Validation Schema for quick manager creation
const quickManagerSchema = z.object({
    name: z.string().min(3, 'اسم المدير يجب أن يكون 3 أحرف على الأقل').max(100, 'اسم المدير طويل جداً'),
    username: z.string().min(3, 'اسم المستخدم مطلوب').regex(/^[a-zA-Z0-9_]+$/, 'اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام فقط'),
    phone: z.string().regex(/^\d+$/, 'رقم الهاتف يجب أن يكون أرقام فقط').min(6, 'رقم الهاتف يجب أن يكون 6 أرقام على الأقل').max(15, 'رقم الهاتف طويل جداً'),
    password: z.string().min(6, 'كلمة المرور مطلوبة'),
})

export default function QuickCreateManagerDialog({ open, onClose, onSubmit, loading }) {
    const { addNotification: showNotification } = useNotification()

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(quickManagerSchema),
        defaultValues: {
            name: '',
            username: '',
            phone: '',
            password: '',
        }
    })

    const handleFormSubmit = (data) => {
        onSubmit(data)
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <ModernDialog
            open={open}
            onClose={handleClose}
            title="إضافة مدير جديد"
            subtitle="إنشاء مدير جديد للقاعة الحالية"
            isForm={true}
            onSubmit={handleSubmit(handleFormSubmit, (errors) => {
                const firstError = Object.values(errors)[0]
                showNotification({
                    title: 'بيانات غير مكتملة',
                    message: firstError?.message || 'يرجى التحقق من الحقول المطلوبة',
                    type: 'error'
                })
            })}
            loading={loading}
            submitText="إضافة المدير"
            cancelText="إلغاء"
            maxWidth="sm"
        >
            <MuiGrid container spacing={3}>
                {/* Basic Info */}
                <MuiGrid item xs={12}>
                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'var(--color-icon)' }}>
                        المعلومات الأساسية
                    </MuiTypography>
                </MuiGrid>

                <MuiGrid item xs={12}>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label="اسم المدير"
                                fullWidth
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        )}
                    />
                </MuiGrid>

                <MuiGrid item xs={12}>
                    <Controller
                        name="username"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label="اسم المستخدم (للدخول)"
                                fullWidth
                                error={!!errors.username}
                                helperText={errors.username?.message}
                                placeholder="مثال: manager123"
                            />
                        )}
                    />
                </MuiGrid>

                <MuiGrid item xs={12}>
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label="رقم الهاتف"
                                fullWidth
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                            />
                        )}
                    />
                </MuiGrid>

                <MuiGrid item xs={12}>
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label="كلمة المرور"
                                type="password"
                                fullWidth
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        )}
                    />
                </MuiGrid>
            </MuiGrid>
        </ModernDialog>
    )
}
