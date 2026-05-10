import { useState, useEffect, useMemo } from 'react'
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
import { ModernDialog } from '@/components/common'
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react'
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

    const hallsList = useMemo(() => {
        if (!hallsData) return []
        if (Array.isArray(hallsData)) return hallsData
        if (Array.isArray(hallsData.data)) return hallsData.data
        if (Array.isArray(hallsData.halls)) return hallsData.halls
        if (Array.isArray(hallsData.data?.halls)) return hallsData.data.halls
        return []
    }, [hallsData])

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
                // Get hallId from various possible paths
                let initialHallId = editingTemplate.hallId?._id || editingTemplate.hallId || '';
                
                // If not found, look into the halls array (from the latest API response)
                if (!initialHallId && Array.isArray(editingTemplate.halls) && editingTemplate.halls.length > 0) {
                    initialHallId = editingTemplate.halls[0].hall?._id || editingTemplate.halls[0].hall || '';
                }

                reset({
                    templateName: editingTemplate.templateName || '',
                    description: editingTemplate.description || '',
                    hallId: initialHallId,
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
                // Extract template ID from various possible response structures
                const templateId = result?._id || result?.id || 
                                 result?.data?._id || result?.data?.id || 
                                 result?.template?._id || result?.template?.id ||
                                 editingTemplate?._id || editingTemplate?.id;

                if (templateId) {
                    await assignTemplateToHall(templateId, data.hallId)
                    showNotification({
                        title: 'تم',
                        message: 'تم حفظ القالب وربطه بالقاعة بنجاح',
                        type: 'success'
                    })
                }
            } catch (error) {
                console.error('Error assigning template to hall:', error);
                showNotification({
                    title: 'تنبيه',
                    message: 'تم حفظ القالب ولكن فشل ربطه تلقائياً بالقاعة. يمكنك ربطه يدوياً من إعدادات الصالة.',
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
        <ModernDialog
            open={open}
            onClose={onClose}
            title={editingTemplate ? 'تعديل القالب' : 'إضافة قالب جديد'}
            subtitle={editingTemplate ? 'تعديل تفاصيل القالب' : 'إضافة قالب جديد للنظام'}
            maxWidth="md"
            showCancel={true}
            cancelText="إلغاء"
            submitText={editingTemplate ? 'تحديث' : 'إضافة'}
            onSubmit={handleSubmit(handleFormSubmit, (errors) => {
                const firstError = Object.values(errors)[0]
                showNotification({
                    title: 'بيانات غير مكتملة',
                    message: firstError?.message || 'يرجى التحقق من الحقول المطلوبة',
                    type: 'error'
                })
            })}
            loading={loading}
            isForm={true}
            headerIcon={<ImageIcon size={24} />}
        >
            <MuiGrid container spacing={3}>
                {/* Basic Info */}
                <MuiGrid item xs={12}>
                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'var(--color-icon)' }}>
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
                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'var(--color-icon)' }}>
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
                                backgroundColor: 'color-mix(in srgb, var(--color-light) 2%, transparent)',
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: 'color-mix(in srgb, var(--color-light) 5%, transparent)',
                                    borderColor: 'var(--color-icon)',
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
                                    <UploadCloud size={48} style={{ color: 'var(--color-icon)', marginBottom: '16px' }} />
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
                                        backgroundColor: 'var(--color-icon)',
                                        color: 'var(--color-text-primary)',
                                        '&:hover': {
                                            backgroundColor: 'var(--color-icon)',
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
        </ModernDialog>
    )
}

