// src\pages\manager\components\CreateEditTemplateDialog.jsx
import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiButton from '@/components/ui/MuiButton'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiIconButton from '@/components/ui/MuiIconButton'
import { FormDialog } from '@/components/common'
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react'
import { FILE_UPLOAD } from '@/config/constants'
import { useNotification } from '@/hooks'

// Validation Schema - فقط templateName و image
const createTemplateSchema = () => z.object({
    templateName: z.string().min(3, 'اسم القالب يجب أن يكون 3 أحرف على الأقل').max(100, 'اسم القالب طويل جداً'),
})

export default function CreateEditTemplateDialog({ open, onClose, onSubmit, editingTemplate, loading }) {
    const { addNotification: showNotification } = useNotification()
    const [previewImage, setPreviewImage] = useState(null)

    const {
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(createTemplateSchema()),
        defaultValues: {
            templateName: editingTemplate?.templateName || '',
        }
    })

    useEffect(() => {
        if (open) {
            if (editingTemplate) {
                reset({
                    templateName: editingTemplate.templateName || '',
                })
                setTimeout(() => {
                    setPreviewImage(null)
                }, 0)
            } else {
                reset({
                    templateName: '',
                })
                setTimeout(() => {
                    setPreviewImage(null)
                }, 0)
            }
        }
    }, [open, editingTemplate, reset])

    const handleFormSubmit = (data) => {
        const formData = new FormData()
        
        // فقط templateName و image
        formData.append('templateName', data.templateName)
        
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
                    message: 'حجم الصورة كبير جداً. الحد الأقصى هو 5 ميجابايت',
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
            subtitle={editingTemplate ? 'تحديث تفاصيل القالب' : 'إضافة قالب دعوة جديد'}
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
                {/* Template Name */}
                <MuiGrid item xs={12}>
                    <Controller
                        name="templateName"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label="اسم القالب"
                                fullWidth
                                required
                                error={!!errors.templateName}
                                helperText={errors.templateName?.message}
                            />
                        )}
                    />
                </MuiGrid>

                {/* Image Upload - Enhanced Design */}
                <MuiGrid item xs={12}>
                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--color-primary-500)' }}>
                        صورة القالب
                    </MuiTypography>
                    
                    <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* Upload Area */}
                        <MuiBox
                            sx={{
                                border: '2px dashed var(--color-border-glass)',
                                borderRadius: '16px',
                                p: 4,
                                textAlign: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    borderColor: 'var(--color-primary-500)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 24px rgba(216, 185, 138, 0.15)',
                                }
                            }}
                            onClick={() => document.getElementById('template-image-upload').click()}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                                id="template-image-upload"
                            />
                            
                            {previewImage ? (
                                <MuiBox sx={{ position: 'relative', display: 'inline-block' }}>
                                    <img
                                        src={URL.createObjectURL(previewImage)}
                                        alt="Preview"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '300px',
                                            borderRadius: '12px',
                                            border: '2px solid var(--color-primary-500)',
                                            boxShadow: '0 4px 16px rgba(216, 185, 138, 0.3)',
                                        }}
                                    />
                                    <MuiIconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            removeImage()
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            backgroundColor: 'rgba(239, 68, 68, 0.9)',
                                            color: '#fff',
                                            '&:hover': {
                                                backgroundColor: 'rgba(220, 38, 38, 1)',
                                                transform: 'scale(1.1)',
                                            }
                                        }}
                                    >
                                        <X size={18} />
                                    </MuiIconButton>
                                </MuiBox>
                            ) : editingTemplate?.imageUrl ? (
                                <MuiBox sx={{ position: 'relative', display: 'inline-block' }}>
                                    <img
                                        src={editingTemplate.imageUrl.startsWith('http') ? editingTemplate.imageUrl : `http://82.137.244.167:5001/${editingTemplate.imageUrl.startsWith('/') ? editingTemplate.imageUrl.slice(1) : editingTemplate.imageUrl}`}
                                        alt="Current Template"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '300px',
                                            borderRadius: '12px',
                                            border: '2px solid var(--color-border-glass)',
                                        }}
                                    />
                                    <MuiBox
                                        sx={{
                                            position: 'absolute',
                                            inset: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                            borderRadius: '12px',
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease',
                                            '&:hover': {
                                                opacity: 1,
                                            }
                                        }}
                                    >
                                        <MuiButton
                                            variant="contained"
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                document.getElementById('template-image-upload').click()
                                            }}
                                            sx={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                color: 'var(--color-primary-700)',
                                                '&:hover': {
                                                    backgroundColor: '#fff',
                                                }
                                            }}
                                        >
                                            تغيير الصورة
                                        </MuiButton>
                                    </MuiBox>
                                </MuiBox>
                            ) : (
                                <MuiBox>
                                    <MuiBox
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '16px',
                                            background: 'linear-gradient(135deg, rgba(216, 185, 138, 0.2), rgba(216, 185, 138, 0.1))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 16px',
                                            border: '2px solid rgba(216, 185, 138, 0.3)',
                                        }}
                                    >
                                        <UploadCloud size={40} style={{ color: 'var(--color-primary-400)' }} />
                                    </MuiBox>
                                    <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600, mb: 1 }}>
                                        انقر لرفع صورة القالب
                                    </MuiTypography>
                                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>
                                        أو اسحب وأفلت الصورة هنا
                                    </MuiTypography>
                                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-disabled)' }}>
                                        PNG, JPG, GIF - الحد الأقصى 5MB
                                    </MuiTypography>
                                </MuiBox>
                            )}
                        </MuiBox>

                        {/* Helper Text */}
                        {!previewImage && !editingTemplate?.imageUrl && (
                            <MuiBox sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1, 
                                p: 2, 
                                backgroundColor: 'rgba(216, 185, 138, 0.05)',
                                borderRadius: '8px',
                                border: '1px solid rgba(216, 185, 138, 0.2)',
                            }}>
                                <ImageIcon size={18} style={{ color: 'var(--color-primary-400)' }} />
                                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                    {editingTemplate ? 'اختر صورة جديدة لتحديث الصورة الحالية' : 'الصورة مطلوبة لإضافة القالب'}
                                </MuiTypography>
                            </MuiBox>
                        )}
                    </MuiBox>
                </MuiGrid>
            </MuiGrid>
        </FormDialog>
    )
}

