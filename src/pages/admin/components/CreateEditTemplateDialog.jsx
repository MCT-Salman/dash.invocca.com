import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiButton from '@/components/ui/MuiButton'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiIconButton from '@/components/ui/MuiIconButton'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import { FormDialog } from '@/components/common'
import { UploadCloud, X } from 'lucide-react'
import { FILE_UPLOAD } from '@/config/constants'
import { useNotification } from '@/hooks'
import { getHallsList } from '@/api/admin'

// Validation Schema
const createTemplateSchema = (editingTemplate = null) => z.object({
    templateName: z.string().min(3, 'اسم القالب يجب أن يكون 3 أحرف على الأقل').max(100, 'اسم القالب طويل جداً'),
    hallId: z.string().min(1, 'قاعة/صالة مطلوبة'),
    description: z.string().optional(),
})

export default function CreateEditTemplateDialog({ open, onClose, onSubmit, editingTemplate, loading }) {
    const { addNotification: showNotification } = useNotification()
    const [previewImage, setPreviewImage] = useState(null)

    const { data: hallsData } = useQuery({
        queryKey: ['admin', 'halls-list'],
        queryFn: getHallsList,
        staleTime: 5 * 60 * 1000
    })

    const hallsList = Array.isArray(hallsData)
        ? hallsData
        : (Array.isArray(hallsData?.data) ? hallsData.data : (hallsData?.halls || []))

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm({
        resolver: zodResolver(createTemplateSchema(editingTemplate)),
        defaultValues: {
            templateName: editingTemplate?.templateName || '',
            hallId: editingTemplate?.hallId?._id || '',
            description: editingTemplate?.description || '',
        }
    })

    useEffect(() => {
        if (open) {
            if (editingTemplate) {
                reset({
                    templateName: editingTemplate.templateName || '',
                    hallId: editingTemplate.hallId?._id || '',
                    description: editingTemplate.description || '',
                })
                setPreviewImage(null)
            } else {
                reset({
                    templateName: '',
                    hallId: '',
                    description: '',
                })
                setPreviewImage(null)
            }
        }
    }, [open, editingTemplate, reset])

    const handleFormSubmit = (data) => {
        const formData = new FormData()

        // Append simple fields
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) {
                formData.append(key, data[key])
            }
        })

        // Append image if exists
        if (previewImage) {
            formData.append('image', previewImage)
        }

        onSubmit(formData)
    }

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > FILE_UPLOAD.MAX_SIZE) {
                showNotification({
                    title: 'خطأ',
                    message: 'حجم الصورة كبير جداً',
                    type: 'error'
                })
                return
            }
            setPreviewImage(file)
        }
    }

    const removeImage = () => {
        setPreviewImage(null)
    }

    return (
        <FormDialog
            open={open}
            onClose={onClose}
            title={editingTemplate ? 'تعديل القالب' : 'إضافة قالب جديد'}
            onSubmit={handleSubmit(handleFormSubmit, (errors) => {
                const firstError = Object.values(errors)[0]
                showNotification({
                    title: 'بيانات غير مكتملة',
                    message: firstError?.message || 'يرجى التحقق من الحقول المطلوبة',
                    type: 'error'
                })
            })}
            loading={loading}
            submitText={editingTemplate ? 'تحديث' : 'إضافة'}
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

                <MuiGrid item xs={12} md={12}>
                    <Controller
                        name="templateName"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label="اسم القالب"
                                fullWidth
                                error={!!errors.templateName}
                                helperText={errors.templateName?.message}
                            />
                        )}
                    />
                </MuiGrid>

                {/* <MuiGrid item xs={12} md={6}>
                    <Controller
                        name="hallId"
                        control={control}
                        render={({ field }) => (
                            <MuiSelect
                                {...field}
                                label="قاعة/صالة"
                                fullWidth
                                error={!!errors.hallId}
                                helperText={errors.hallId?.message}
                            >
                                {hallsList.map((hall) => (
                                    <MuiMenuItem key={hall._id} value={hall._id}>
                                        {hall.name}
                                    </MuiMenuItem>
                                ))}
                            </MuiSelect>
                        )}
                    />
                </MuiGrid> */}

                <MuiGrid item xs={12}>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label="الوصف"
                                fullWidth
                                multiline
                                rows={4}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                            />
                        )}
                    />
                </MuiGrid>

                {/* Image Upload */}
                <MuiGrid item xs={12}>
                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'var(--color-primary-500)' }}>
                        صورة القالب
                    </MuiTypography>
                </MuiGrid>

                <MuiGrid item xs={12}>
                    <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <MuiBox
                            sx={{
                                border: '2px dashed var(--color-border-glass)',
                                borderRadius: '12px',
                                p: 3,
                                textAlign: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    borderColor: 'var(--color-primary-500)',
                                }
                            }}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                                id="template-image-upload"
                            />
                            <label htmlFor="template-image-upload">
                                <MuiBox sx={{ cursor: 'pointer' }}>
                                    <UploadCloud size={48} style={{ color: 'var(--color-primary-400)', marginBottom: '16px' }} />
                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                        انقر لرفع صورة القالب أو اسحب وأفلت
                                    </MuiTypography>
                                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                        (PNG, JPG, GIF - الحد الأقصى 5MB)
                                    </MuiTypography>
                                </MuiBox>
                            </label>
                        </MuiBox>

                        {/* Show existing image when editing */}
                        {editingTemplate?.imageUrl && !previewImage && (
                            <MuiBox sx={{ position: 'relative', display: 'inline-block' }}>
                                <img
                                    src={editingTemplate.imageUrl.startsWith('http') ? editingTemplate.imageUrl : `${import.meta.env.VITE_API_BASE}${editingTemplate.imageUrl}`}
                                    alt="Current Template"
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        border: '1px solid var(--color-border-glass)'
                                    }}
                                />
                                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', mt: 1, display: 'block' }}>
                                    الصورة الحالية
                                </MuiTypography>
                            </MuiBox>
                        )}

                        {/* Show new preview image */}
                        {previewImage && (
                            <MuiBox sx={{ position: 'relative', display: 'inline-block' }}>
                                <img
                                    src={URL.createObjectURL(previewImage)}
                                    alt="Preview"
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        border: '1px solid var(--color-border-glass)'
                                    }}
                                />
                                <MuiIconButton
                                    size="small"
                                    onClick={removeImage}
                                    sx={{
                                        position: 'absolute',
                                        top: -8,
                                        right: -8,
                                        backgroundColor: 'rgba(239, 68, 68, 0.9)',
                                        color: '#fff',
                                        '&:hover': {
                                            backgroundColor: 'rgba(220, 38, 38, 1)',
                                        }
                                    }}
                                >
                                    <X size={16} />
                                </MuiIconButton>
                                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', mt: 1, display: 'block' }}>
                                    صورة جديدة
                                </MuiTypography>
                            </MuiBox>
                        )}
                    </MuiBox>
                </MuiGrid>
            </MuiGrid>
        </FormDialog>
    )
}
