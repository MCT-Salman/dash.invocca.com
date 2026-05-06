// src\pages\manager\components\CreateEditSongDialog.jsx
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiSwitch from '@/components/ui/MuiSwitch'
import { FormDialog } from '@/components/common'

const songSchema = z.object({
    title: z.string().min(2, 'العنوان يجب أن يكون 2 حرف على الأقل'),
    artist: z.string().min(2, 'الفنان يجب أن يكون 2 حرف على الأقل'),
    category: z.string().optional(),
    isActive: z.boolean().default(true),
})

export default function CreateEditSongDialog({ open, onClose, onSubmit, editingSong, loading }) {
    const { handleSubmit, control, reset, formState: { errors } } = useForm({
        resolver: zodResolver(songSchema),
        defaultValues: {
            title: '',
            artist: '',
            category: '',
            isActive: true,
        }
    })

    useEffect(() => {
        if (open) {
            reset(editingSong || { title: '', artist: '', category: '', isActive: true })
        }
    }, [open, editingSong, reset])

    return (
        <FormDialog
            open={open}
            onClose={onClose}
            title={editingSong ? 'تعديل أغنية' : 'إضافة أغنية جديدة'}
            onSubmit={handleSubmit(onSubmit)}
            loading={loading}
            submitText={editingSong ? 'تعديل' : 'إضافة'}
            maxWidth="sm"
        >
            <MuiGrid container spacing={2}>
                <MuiGrid item xs={12}>
                    <Controller
                        name="title"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField {...field} label="عنوان الأغنية" fullWidth required error={!!errors.title} helperText={errors.title?.message} />
                        )}
                    />
                </MuiGrid>
                <MuiGrid item xs={12}>
                    <Controller
                        name="artist"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField {...field} label="الفنان" fullWidth required error={!!errors.artist} helperText={errors.artist?.message} />
                        )}
                    />
                </MuiGrid>
                <MuiGrid item xs={12}>
                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField {...field} label="الفئة" fullWidth error={!!errors.category} helperText={errors.category?.message} />
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
