import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiSwitch from '@/components/ui/MuiSwitch'
import MuiFormControl from '@/components/ui/MuiFormControl'
import MuiInputLabel from '@/components/ui/MuiInputLabel'
import { FormDialog } from '@/components/common'
import { getHallsList } from '@/api/admin'
import { useNotification } from '@/hooks'

// Validation Schema
const createManagerSchema = (editingManager = null) => z.object({
    name: z.string().min(3, 'اسم المدير يجب أن يكون 3 أحرف على الأقل').max(100, 'اسم المدير طويل جداً'),
    username: editingManager
        ? z.string().min(3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل').regex(/^[a-zA-Z0-9_]+$/, 'اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام فقط').optional()
        : z.string().min(3, 'اسم المستخدم مطلوب').regex(/^[a-zA-Z0-9_]+$/, 'اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام فقط'),
    phone: z.string().regex(/^\d+$/, 'رقم الهاتف يجب أن يكون أرقام فقط').min(6, 'رقم الهاتف يجب أن يكون 6 أرقام على الأقل').max(15, 'رقم الهاتف طويل جداً'),
    password: editingManager
        ? z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل').optional().or(z.literal(''))
        : z.string().min(6, 'كلمة المرور مطلوبة'),
    hallId: z.string().optional(),
    isActive: z.boolean().default(true)
})

export default function CreateEditManagerDialog({ open, onClose, onSubmit, editingManager, loading }) {
    const { addNotification: showNotification } = useNotification()

    const { data: hallsData } = useQuery({
        queryKey: ['admin', 'halls-list'],
        queryFn: getHallsList,
        staleTime: 5 * 60 * 1000
    })

    const hallsList = Array.isArray(hallsData)
        ? hallsData
        : (Array.isArray(hallsData?.data) ? hallsData.data : (hallsData?.halls || []))

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(createManagerSchema(editingManager)),
        defaultValues: {
            name: editingManager?.name || '',
            username: editingManager?.username || '',
            phone: editingManager?.phone || '',
            password: '',
            hallId: editingManager?.hallId?._id || editingManager?.hallId || '',
            isActive: editingManager?.isActive ?? true
        }
    })

    useEffect(() => {
        if (open) {
            if (editingManager) {
                reset({
                    name: editingManager.name,
                    username: editingManager.username || '',
                    phone: editingManager.phone,
                    password: '',
                    hallId: editingManager.hallId?._id || editingManager.hallId || '',
                    isActive: editingManager.isActive ?? true
                })
            } else {
                reset({
                    name: '',
                    username: '',
                    phone: '',
                    password: '',
                    hallId: '',
                    isActive: true
                })
            }
        }
    }, [open, editingManager, reset])

    const handleFormSubmit = (data) => {
        // Remove password if empty during edit
        if (editingManager && !data.password) {
            delete data.password
        }
        onSubmit(data)
    }

    return (
        <FormDialog
            open={open}
            onClose={onClose}
            title={editingManager ? 'تعديل المدير' : 'إضافة مدير جديد'}
            onSubmit={handleSubmit(handleFormSubmit, (errors) => {
                const firstError = Object.values(errors)[0]
                showNotification({
                    title: 'بيانات غير مكتملة',
                    message: firstError?.message || 'يرجى التحقق من الحقول المطلوبة',
                    type: 'error'
                })
            })}
            loading={loading}
            submitText={editingManager ? 'تحديث' : 'إضافة'}
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
                                disabled={!!editingManager}
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
                                label={editingManager ? "كلمة المرور (اتركها فارغة لعدم التغيير)" : "كلمة المرور"}
                                type="password"
                                fullWidth
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        )}
                    />
                </MuiGrid>

                {/* Hall Assignment */}
                <MuiGrid item xs={12}>
                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, mt: 1, color: 'var(--color-primary-500)' }}>
                        القاعة المسؤول عنها
                    </MuiTypography>
                </MuiGrid>

                <MuiGrid item xs={12}>
                    <Controller
                        name="hallId"
                        control={control}
                        render={({ field }) => (
                            <MuiFormControl fullWidth error={!!errors.hallId}>
                                <MuiInputLabel>القاعة</MuiInputLabel>
                                <MuiSelect
                                    {...field}
                                    label="القاعة"
                                >
                                    <MuiMenuItem value="">
                                        <em>غير معين</em>
                                    </MuiMenuItem>
                                    {Array.isArray(hallsList) && hallsList.map(hall => (
                                        <MuiMenuItem key={hall._id || hall.id} value={hall._id || hall.id}>
                                            {hall.name}
                                        </MuiMenuItem>
                                    ))}
                                </MuiSelect>
                            </MuiFormControl>
                        )}
                    />
                </MuiGrid>

                {/* Status */}
                <MuiGrid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Controller
                        name="isActive"
                        control={control}
                        render={({ field }) => (
                            <MuiSwitch
                                checked={field.value}
                                onChange={field.onChange}
                                color="success"
                                label="المدير نشط"
                            />
                        )}
                    />
                </MuiGrid>
            </MuiGrid>
        </FormDialog>
    )
}
