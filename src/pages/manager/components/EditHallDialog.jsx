import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import { FormDialog } from '@/components/common'
import { useNotification } from '@/hooks'

// Validation Schema
const editHallSchema = z.object({
    name: z.string().min(3, 'اسم قاعة/صالة يجب أن يكون 3 أحرف على الأقل').max(100, 'اسم قاعة/صالة طويل جداً'),
    location: z.string().min(3, 'الموقع مطلوب').max(200, 'الموقع طويل جداً'),
    capacity: z.coerce.number().min(1, 'السعة مطلوبة').max(10000, 'السعة كبيرة جداً'),
    tables: z.coerce.number().min(0, 'عدد الطاولات يجب أن يكون 0 أو أكثر').max(1000, 'عدد الطاولات كبير جداً'),
    chairs: z.coerce.number().min(0, 'عدد الكراسي يجب أن يكون 0 أو أكثر').max(10000, 'عدد الكراسي كبير جداً'),
    description: z.string().optional(),
})

export default function EditHallDialog({ open, onClose, onSubmit, hall, loading }) {
    const { addNotification: showNotification } = useNotification()

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(editHallSchema),
        defaultValues: {
            name: hall?.name || '',
            location: hall?.location || hall?.address || '',
            capacity: hall?.capacity || 0,
            tables: hall?.tables || 0,
            chairs: hall?.chairs || 0,
            description: hall?.description || ''
        }
    })

    useEffect(() => {
        if (open && hall) {
            reset({
                name: hall.name || '',
                location: hall.location || hall.address || '',
                capacity: hall.capacity || 0,
                tables: hall.tables || 0,
                chairs: hall.chairs || 0,
                description: hall.description || ''
            })
        }
    }, [open, hall, reset])

    const handleFormSubmit = (data) => {
        onSubmit(data)
    }

    return (
        <FormDialog
            open={open}
            onClose={onClose}
            title="تعديل معلومات قاعة/صالة"
            onSubmit={handleSubmit(handleFormSubmit, (errors) => {
                const firstError = Object.values(errors)[0]
                showNotification({
                    title: 'بيانات غير مكتملة',
                    message: firstError?.message || 'يرجى التحقق من الحقول المطلوبة',
                    type: 'error'
                })
            })}
            loading={loading}
            submitText="حفظ التغييرات"
            cancelText="إلغاء"
            maxWidth="md"
        >
            <MuiGrid container spacing={3}>
                {/* Basic Info */}
                <MuiGrid item xs={12}>
                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'var(--color-primary-500)' }}>
                        المعلومات الأساسية
                    </MuiTypography>
                </MuiGrid>

                <MuiGrid item xs={12} sm={6}>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label="اسم قاعة/صالة"
                                fullWidth
                                required
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        )}
                    />
                </MuiGrid>

                <MuiGrid item xs={12} sm={6}>
                    <Controller
                        name="location"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label="الموقع"
                                fullWidth
                                required
                                error={!!errors.location}
                                helperText={errors.location?.message}
                            />
                        )}
                    />
                </MuiGrid>

                {/* Capacity & Equipment */}
                <MuiGrid item xs={12}>
                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, mt: 1, color: 'var(--color-primary-500)' }}>
                        السعة والمعدات
                    </MuiTypography>
                </MuiGrid>

                <MuiGrid item xs={12} sm={4}>
                    <Controller
                        name="capacity"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label="السعة القصوى"
                                type="number"
                                fullWidth
                                required
                                error={!!errors.capacity}
                                helperText={errors.capacity?.message}
                            />
                        )}
                    />
                </MuiGrid>

                <MuiGrid item xs={12} sm={4}>
                    <Controller
                        name="tables"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label="عدد الطاولات"
                                type="number"
                                fullWidth
                                error={!!errors.tables}
                                helperText={errors.tables?.message}
                            />
                        )}
                    />
                </MuiGrid>

                <MuiGrid item xs={12} sm={4}>
                    <Controller
                        name="chairs"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label="عدد الكراسي"
                                type="number"
                                fullWidth
                                error={!!errors.chairs}
                                helperText={errors.chairs?.message}
                            />
                        )}
                    />
                </MuiGrid>

                {/* Description */}
                <MuiGrid item xs={12}>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label="الوصف"
                                multiline
                                rows={4}
                                fullWidth
                            />
                        )}
                    />
                </MuiGrid>
            </MuiGrid>
        </FormDialog>
    )
}

