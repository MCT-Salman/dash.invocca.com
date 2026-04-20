import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiIconButton from '@/components/ui/MuiIconButton'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import { FormDialog } from '@/components/common'
import { UploadCloud, X } from 'lucide-react'
import { FILE_UPLOAD } from '@/config/constants'
import { useNotification } from '@/hooks'
import { getAllHalls, assignTemplateToHall } from '@/api/admin'

// Validation Schema
const createTemplateSchema = z.object({
    templateName: z.string().min(3, 'اسم القالب يجب أن يكون 3 أحرف على الأقل').max(100, 'اسم القالب طويل جداً'),
    description: z.string().optional(),
    hallId: z.string().optional(),
})

export default function CreateEditTemplateDialog({ open, onClose, onSubmit, editingTemplate, loading }) {
    const { addNotification: showNotification } = useNotification()
    const [previewImage, setPreviewImage] = useState(null)

    // Fetch halls
    const { data: hallsData, isLoading: hallsLoading } = useQuery({
        queryKey: ['admin', 'halls-list'],
        queryFn: getAllHalls,
        enabled: open,
        staleTime: 5 * 60 * 1000
    })

    const hallsList = Array.isArray(hallsData)
        ? hallsData
        : (Array.isArray(hallsData?.data) ? hallsData.data
            : (Array.isArray(hallsData?.halls) ? hallsData.halls
                : (Array.isArray(hallsData?.data?.halls) ? hallsData.data.halls : [])))

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm({
        resolver: zodResolver(createTemplateSchema),
        defaultValues: {
            templateName: '',
            description: '',
            hallId: '',
        }
    })



    useEffect(() => {
        if (open) {
            if (editingTemplate) {
                reset({
                    templateName: editingTemplate.templateName || '',
                    description: editingTemplate.description || '',
                    hallId: '',
                })
                setPreviewImage(null)
            } else {
                reset({
                    templateName: '',
                    description: '',
                    hallId: '',
                })
                setPreviewImage(null)
            }
        }
    }, [open, editingTemplate, reset])



    const handleFormSubmit = async (data) => {
        const formData = new FormData()

        // Append simple fields (excluding hallId - it's handled separately)
        formData.append('templateName', data.templateName)
        if (data.description) {
            formData.append('description', data.description)
        }

        // Append image if exists
        if (previewImage) {
            formData.append('image', previewImage)
        }

        // Submit template first
        const result = await onSubmit(formData)

        // If hallId is selected, assign template to hall
        if (data.hallId && data.hallId !== '') {
            try {
                // Handle both editing (existing template) and creating new template
                const templateId = editingTemplate?._id || editingTemplate?.id || result?._id || result?.id || result?.template?._id || result?.template?.id
                if (templateId) {
                    await assignTemplateToHall(templateId, data.hallId)
                    showNotification({
                        title: 'تم',
                        message: 'تم ربط القالب بالقاعة بنجاح',
                        type: 'success'
                    })
                }
            } catch (error) {
                showNotification({
                    title: 'تنبيه',
                    message: 'تم حفظ القالب ولكن فشل ربطه بالقاعة',
                    type: 'warning'
                })
            }
        }
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

                <MuiGrid item xs={12} md={6}>
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

                <MuiGrid item xs={12} md={6}>
                    <Controller
                        name="hallId"
                        control={control}
                        render={({ field }) => (
                            <MuiSelect
                                {...field}
                                label="قاعة/صالة (اختياري)"
                                fullWidth
                                disabled={hallsLoading}
                                displayEmpty
                                renderValue={(selected) => {
                                    if (!selected) return <em>اختر قاعة/صالة للربط (اختياري)</em>
                                    const hall = hallsList.find(h => (h._id || h.id) === selected)
                                    return hall?.name || selected
                                }}
                            >
                                <MuiMenuItem value="">
                                    <em>{hallsLoading ? 'جاري تحميل القاعات...' : 'لا يوجد ربط'}</em>
                                </MuiMenuItem>
                                {!hallsLoading && Array.isArray(hallsList) && hallsList.map((hall) => {
                                    const hallId = hall._id || hall.id
                                    return (
                                        <MuiMenuItem key={hallId} value={hallId}>
                                            {hall.name}
                                        </MuiMenuItem>
                                    )
                                })}
                            </MuiSelect>
                        )}
                    />
                </MuiGrid>

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
                                        color: 'var(--color-text-primary)',
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

