// src\pages\manager\components\CreateEditServiceDialog.jsx
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiSwitch from '@/components/ui/MuiSwitch'
import { FormDialog } from '@/components/common'

const serviceSchema = z.object({
    name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
    price: z.coerce.number().min(0, 'السعر يجب أن يكون 0 أو أكثر'),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
})

export default function CreateEditServiceDialog({ open, onClose, onSubmit, editingService, loading }) {
    const { handleSubmit, control, reset, formState: { errors } } = useForm({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            name: '',
            price: 0,
            description: '',
            isActive: true,
        }
    })

    useEffect(() => {
        if (open) {
            reset(editingService || { name: '', price: 0, description: '', isActive: true })
        }
    }, [open, editingService, reset])

    return (
        <FormDialog
            open={open}
            onClose={onClose}
            title={editingService ? 'تعديل خدمة' : 'إضافة خدمة جديدة'}
            onSubmit={handleSubmit(onSubmit)}
            loading={loading}
            submitText={editingService ? 'تعديل' : 'إضافة'}
            maxWidth="sm"
        >
            <MuiGrid container spacing={2}>
                <MuiGrid item xs={12}>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField {...field} label="اسم الخدمة" fullWidth required error={!!errors.name} helperText={errors.name?.message} />
                        )}
                    />
                </MuiGrid>
                <MuiGrid item xs={12}>
                    <Controller
                        name="price"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField {...field} label="السعر" type="number" fullWidth required error={!!errors.price} helperText={errors.price?.message} />
                        )}
                    />
                </MuiGrid>
                <MuiGrid item xs={12}>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField {...field} label="الوصف" fullWidth multiline rows={3} error={!!errors.description} helperText={errors.description?.message} />
                        )}
                    />
                </MuiGrid>
                <MuiGrid item xs={12}>
                    <Controller
                        name="isActive"
                        control={control}
                        render={({ field: { value, onChange, ...field } }) => (
                            <MuiSwitch checked={value} onChange={(e) => onChange(e.target.checked)} label="نشط" {...field} />
                        )}
                    />
                </MuiGrid>
            </MuiGrid>
        </FormDialog>
    )
}
