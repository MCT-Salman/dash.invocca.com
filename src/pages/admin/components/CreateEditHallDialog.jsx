// src\pages\admin\components\CreateEditHallDialog.jsx
import { useState, useEffect } from 'react'
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form'
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
import MuiSwitch from '@/components/ui/MuiSwitch'
import MuiFormControl from '@/components/ui/MuiFormControl'
import MuiInputLabel from '@/components/ui/MuiInputLabel'
import { FormDialog } from '@/components/common'
import { getTemplates } from '@/api/admin'
import { Plus, Trash2, UploadCloud, X } from 'lucide-react'
import { FILE_UPLOAD } from '@/config/constants'
import { useNotification } from '@/hooks'
import { getImageUrl } from '@/utils/helpers'
import { API_CONFIG } from '@/config/constants'

// Helper function to get template image URL
const getTemplateImageUrl = (imageUrl) => {
    if (!imageUrl) return null
    if (typeof imageUrl === 'string') {
        if (imageUrl.startsWith('http')) return imageUrl
        return `${API_CONFIG.BASE_URL}${imageUrl}`
    }
    return null
}

// Validation Schema
const createHallSchema = (editingHall = null) => z.object({
    name: z.string().min(3, 'اسم قاعة/صالة يجب أن يكون 3 أحرف على الأقل').max(100, 'اسم قاعة/صالة طويل جداً'),
    location: z.string().min(3, 'الموقع مطلوب').max(100, 'الموقع طويل جداً'),

    capacity: z.coerce.number().min(1, 'السعة مطلوبة').max(10000, 'السعة كبيرة جداً'),
    tables: z.coerce.number().min(1, 'عدد الطاولات مطلوب').max(1000, 'عدد الطاولات كبير جداً'),
    chairs: z.coerce.number().min(1, 'عدد الكراسي مطلوب').max(10000, 'عدد الكراسي كبير جداً'),
    defaultPrices: z.coerce.number().min(0, 'السعر مطلوب').max(1000000, 'السعر كبير جداً'),

    managerName: z.string().min(3, 'اسم المدير مطلوب').max(100, 'اسم المدير طويل جداً'),
    managerUsername: z.string().min(3, 'اسم المستخدم مطلوب').regex(/^[a-zA-Z0-9_]+$/, 'اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام فقط'),

    managerPhone: z.string().regex(/^\d+$/, 'رقم الهاتف يجب أن يكون أرقام فقط').min(6, 'رقم الهاتف يجب أن يكون 6 أرقام على الأقل').max(15, 'رقم الهاتف طويل جداً'),
    managerPassword: editingHall
        ? z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل').optional().or(z.literal(''))
        : z.string().min(6, 'كلمة المرور مطلوبة'),

    description: z.string().optional(),
    isActive: z.boolean().default(true),

    templates: z.array(z.string()).optional().default([])
})

export default function CreateEditHallDialog({ open, onClose, onSubmit, editingHall, loading }) {
    const { addNotification: showNotification } = useNotification()

    const getHallImagePath = (img) => {
        const path = img?.url || img
        if (!path) return ''
        if (typeof path === 'string' && (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:'))) return path
        return `halls/${path}`
    }
    const [primaryImage, setPrimaryImage] = useState(null)
    const [galleryImages, setGalleryImages] = useState([])
    const [existingGalleryImages, setExistingGalleryImages] = useState([])

    const { data: templatesData } = useQuery({
        queryKey: ['admin', 'templates-list'],
        queryFn: getTemplates,
        staleTime: 5 * 60 * 1000
    })

    const templatesList = Array.isArray(templatesData)
        ? templatesData
        : (Array.isArray(templatesData?.data) ? templatesData.data : (Array.isArray(templatesData?.templates) ? templatesData.templates : []))

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(createHallSchema(editingHall)),
        defaultValues: {
            name: editingHall?.name || '',
            location: editingHall?.location || '',

            capacity: editingHall?.capacity || '',
            tables: editingHall?.tables || '',
            chairs: editingHall?.chairs || '',
            defaultPrices: editingHall?.defaultPrices || '',
            managerName: editingHall?.generalManager?.name || editingHall?.managerName || '',
            managerUsername: editingHall?.generalManager?.username || editingHall?.managerUsername || '',

            managerPhone: editingHall?.generalManager?.phone || editingHall?.managerPhone || '',
            managerPassword: '',
            description: editingHall?.description || '',
            isActive: editingHall?.isActive ?? true,
            templates: editingHall?.templates?.map(t => t.template?._id || t.template || t._id || t).filter(Boolean) || []
        }
    })

    const { fields: templateFields, append: appendTemplate, remove: removeTemplate } = useFieldArray({
        control,
        name: 'templates'
    })

    const watchedTemplates = useWatch({
        control,
        name: 'templates'
    }) || []

    useEffect(() => {
        if (open) {
            if (editingHall) {
                reset({
                    name: editingHall.name,
                    location: editingHall.location,

                    capacity: editingHall.capacity,
                    tables: editingHall.tables || '',
                    chairs: editingHall.chairs || '',
                    defaultPrices: editingHall.defaultPrices,
                    managerName: editingHall.generalManager?.name || editingHall.managerName || '',
                    managerUsername: editingHall.generalManager?.username || editingHall.managerUsername || '',

                    managerPhone: editingHall.generalManager?.phone || editingHall.managerPhone || '',
                    managerPassword: '',
                    description: editingHall.description || '',
                    isActive: editingHall.isActive,
                    templates: editingHall.templates?.map(t => t.template?._id || t.template || t._id || t).filter(Boolean) || []
                })
                // Set existing gallery images after reset to avoid cascading renders
                setTimeout(() => {
                    setExistingGalleryImages(editingHall.images || [])
                }, 0)
            } else {
                reset({
                    name: '',
                    location: '',

                    capacity: '',
                    tables: '',
                    chairs: '',
                    defaultPrices: '',
                    managerName: '',
                    managerUsername: '',

                    managerPhone: '',
                    managerPassword: '',
                    description: '',
                    isActive: true,
                    templates: []
                })
                // Set state after reset to avoid cascading renders
                setTimeout(() => {
                    setPrimaryImage(null)
                    setGalleryImages([])
                    setExistingGalleryImages([])
                }, 0)
            }
        }
    }, [open, editingHall, reset])

    const handleFormSubmit = (data) => {
        // Validation for primary image
        if (!editingHall && !primaryImage) {
            showNotification({
                title: 'خطأ',
                message: 'يرجى اختيار صورة رئيسية لقاعة/صالة',
                type: 'error'
            })
            return
        }

        const formData = new FormData()

        // Append simple fields - convert all values to strings to avoid circular references
        Object.keys(data).forEach(key => {
            if (key === 'managerPassword') {
                if (data[key] && String(data[key]).trim()) {
                    formData.append(key, String(data[key]))
                }
            } else if (data[key] !== undefined && data[key] !== null) {
                // Convert value to string to avoid circular references
                const value = data[key]
                if (typeof value === 'boolean') {
                    formData.append(key, value ? 'true' : 'false')
                } else if (typeof value === 'number') {
                    formData.append(key, String(value))
                } else if (typeof value === 'string') {
                    formData.append(key, value)
                } else {
                    // Skip complex objects (arrays, objects) - they should be handled separately
                    // Only append primitive values
                }
            }
        })

        // Append images
        // Primary image first (as part of images array)
        if (primaryImage) {
            formData.append('images', primaryImage)
        }

        galleryImages.forEach(image => {
            formData.append('images', image)
        })

        if (Array.isArray(data.templates) && data.templates.length > 0) {
            data.templates.forEach((templateId, index) => {
                if (templateId) {
                    formData.append(`templates[${index}]`, String(templateId))
                }
            })
        }

        onSubmit(formData)
    }

    const handlePrimaryImageChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > FILE_UPLOAD.MAX_SIZE) {
                // Handle error
                return
            }
            setPrimaryImage(file)
        }
    }

    const handleGalleryImagesChange = (e) => {
        const files = Array.from(e.target.files || [])
        const validFiles = files.filter(file => file.size <= FILE_UPLOAD.MAX_SIZE)
        setGalleryImages(prev => [...prev, ...validFiles])
    }

    const removeGalleryImage = (index) => {
        setGalleryImages(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <FormDialog
            open={open}
            onClose={onClose}
            title={editingHall ? 'تعديل قاعة/صالة' : 'إضافة قاعة/صالة جديدة'}
            onSubmit={handleSubmit(handleFormSubmit, (errors) => {
                const firstError = Object.values(errors)[0]
                showNotification({
                    title: 'بيانات غير مكتملة',
                    message: firstError?.message || 'يرجى التحقق من الحقول المطلوبة',
                    type: 'error'
                })
            })}
            loading={loading}
            submitText={editingHall ? 'تحديث' : 'إضافة'}
            cancelText="إلغاء"
            maxWidth="lg"
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
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label="اسم قاعة/صالة"
                                fullWidth
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        )}
                    />
                </MuiGrid>

                <MuiGrid item xs={12} md={6}>
                    <Controller
                        name="location"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label="الموقع (الحي/المنطقة)"
                                fullWidth
                                error={!!errors.location}
                                helperText={errors.location?.message}
                            />
                        )}
                    />
                </MuiGrid>

                <MuiGrid item xs={12} md={12}>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label="الوصف"
                                fullWidth
                                multiline
                                rows={3}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                            />
                        )}
                    />
                </MuiGrid>

                {/* Capacity & Pricing */}
                <MuiGrid item xs={12}>
                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, mt: 1, color: 'var(--color-primary-500)' }}>
                        السعة والأسعار
                    </MuiTypography>
                </MuiGrid>

                <MuiGrid item xs={6} md={3}>
                    <Controller
                        name="capacity"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label="السعة (شخص)"
                                type="number"
                                fullWidth
                                error={!!errors.capacity}
                                helperText={errors.capacity?.message}
                            />
                        )}
                    />
                </MuiGrid>

                <MuiGrid item xs={6} md={3}>
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

                <MuiGrid item xs={6} md={3}>
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

                <MuiGrid item xs={12} md={6}>
                    <Controller
                        name="defaultPrices"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label="السعر الافتراضي"
                                type="number"
                                fullWidth
                                error={!!errors.defaultPrices}
                                helperText={errors.defaultPrices?.message}
                                InputProps={{
                                    endAdornment: <span style={{ color: 'var(--color-text-secondary)' }}>ل.س</span>
                                }}
                            />
                        )}
                    />
                </MuiGrid>

                <MuiGrid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Controller
                        name="isActive"
                        control={control}
                        render={({ field }) => (
                            <MuiSwitch
                                checked={field.value}
                                onChange={field.onChange}
                                color="success"
                                label="قاعة/صالة نشطة"
                            />
                        )}
                    />
                </MuiGrid>

                {/* Manager Info */}
                <MuiGrid item xs={12}>
                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, mt: 1, color: 'var(--color-primary-500)' }}>
                        معلومات المدير
                    </MuiTypography>
                </MuiGrid>

                <MuiGrid item xs={12} md={6}>
                    <Controller
                        name="managerName"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label="اسم المدير"
                                fullWidth
                                error={!!errors.managerName}
                                helperText={errors.managerName?.message}
                            />
                        )}
                    />
                </MuiGrid>

                <MuiGrid item xs={12} md={6}>
                    <Controller
                        name="managerUsername"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label="اسم المستخدم (للدخول)"
                                fullWidth
                                error={!!errors.managerUsername}
                                helperText={errors.managerUsername?.message}
                                disabled={!!editingHall}
                            />
                        )}
                    />
                </MuiGrid>

                <MuiGrid item xs={12} md={6}>
                    <Controller
                        name="managerPhone"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label="رقم هاتف المدير"
                                fullWidth
                                error={!!errors.managerPhone}
                                helperText={errors.managerPhone?.message}
                            />
                        )}
                    />
                </MuiGrid>

                <MuiGrid item xs={12} md={6}>
                    <Controller
                        name="managerPassword"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label={editingHall ? "كلمة المرور (اتركها فارغة لعدم التغيير)" : "كلمة المرور"}
                                type="password"
                                fullWidth
                                error={!!errors.managerPassword}
                                helperText={errors.managerPassword?.message}
                            />
                        )}
                    />
                </MuiGrid>

                {/* Templates */}
                <MuiGrid item xs={12}>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, mt: 1 }}>
                        <MuiTypography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'var(--color-primary-500)' }}>
                            القوالب
                        </MuiTypography>
                        <MuiButton
                            size="small"
                            startIcon={<Plus size={16} />}
                            onClick={() => appendTemplate('')}
                            variant="outlined"
                        >
                            إضافة قالب
                        </MuiButton>
                    </MuiBox>

                    {templateFields.map((field, index) => {
                        const selectedTemplateId = watchedTemplates[index] || ''
                        const selectedTemplate = templatesList.find(t => (t._id || t.id) === selectedTemplateId)
                        const selectedTemplateImageUrl = selectedTemplate ? getTemplateImageUrl(selectedTemplate.imageUrl) : null
                        
                        return (
                            <MuiBox key={field.id} sx={{ mb: 2 }}>
                                <MuiBox sx={{ display: 'flex', gap: 2, mb: 1.5, alignItems: 'flex-start' }}>
                            <Controller
                                        name={`templates.${index}`}
                                control={control}
                                render={({ field: selectField }) => (
                                    <MuiSelect
                                        {...selectField}
                                        sx={{ flexGrow: 1 }}
                                        size="small"
                                                displayEmpty
                                                error={!!errors.templates?.[index]}
                                                renderValue={(value) => {
                                                    if (!value) return <em>اختر قالباً</em>
                                                    const template = templatesList.find(t => (t._id || t.id) === value)
                                                    if (!template) return value
                                                    return (
                                                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            {template.imageUrl && (
                                                                <img 
                                                                    src={getTemplateImageUrl(template.imageUrl)} 
                                                                    alt={template.templateName || ''}
                                                                    style={{ 
                                                                        width: 24, 
                                                                        height: 24, 
                                                                        objectFit: 'cover', 
                                                                        borderRadius: '4px' 
                                                                    }}
                                                                />
                                                            )}
                                                            <span>{template.templateName || template.name || value}</span>
                                                        </MuiBox>
                                                    )
                                                }}
                                            >
                                                <MuiMenuItem value="">
                                                    <em>اختر قالباً</em>
                                                </MuiMenuItem>
                                                {Array.isArray(templatesList) && templatesList.map(template => {
                                                    const templateImageUrl = getTemplateImageUrl(template.imageUrl)
                                                    return (
                                                        <MuiMenuItem key={template._id || template.id} value={template._id || template.id}>
                                                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%', py: 0.5 }}>
                                                                {templateImageUrl ? (
                                                                    <img 
                                                                        src={templateImageUrl} 
                                                                        alt={template.templateName || ''}
                                                                        style={{ 
                                                                            width: 50, 
                                                                            height: 50, 
                                                                            objectFit: 'cover', 
                                                                            borderRadius: '6px',
                                                                            border: '1px solid var(--color-border-glass)',
                                                                            flexShrink: 0
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <MuiBox 
                                                                        sx={{ 
                                                                            width: 50, 
                                                                            height: 50, 
                                                                            borderRadius: '6px',
                                                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                                            border: '1px solid var(--color-border-glass)',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            flexShrink: 0
                                                                        }}
                                                                    >
                                                                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontSize: '9px', textAlign: 'center', px: 0.5 }}>
                                                                            بدون صورة
                                                                        </MuiTypography>
                                                                    </MuiBox>
                                                                )}
                                                                <MuiBox sx={{ flex: 1, minWidth: 0 }}>
                                                                    <MuiTypography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                                                                        {template.templateName || template.name || template._id || template.id}
                                                                    </MuiTypography>
                                                                    {template.description && (
                                                                        <MuiTypography 
                                                                            variant="caption" 
                                                                            sx={{ 
                                                                                color: 'var(--color-text-secondary)',
                                                                                overflow: 'hidden',
                                                                                textOverflow: 'ellipsis',
                                                                                display: '-webkit-box',
                                                                                WebkitLineClamp: 1,
                                                                                WebkitBoxOrient: 'vertical',
                                                                                lineHeight: 1.3
                                                                            }}
                                                                        >
                                                                            {template.description}
                                                                        </MuiTypography>
                                                                    )}
                                                                </MuiBox>
                                                            </MuiBox>
                                            </MuiMenuItem>
                                                    )
                                                })}
                                    </MuiSelect>
                                )}
                            />
                            <MuiIconButton
                                        onClick={() => removeTemplate(index)}
                                color="error"
                                size="small"
                                sx={{ mt: 0.5 }}
                            >
                                <Trash2 size={20} />
                            </MuiIconButton>
                        </MuiBox>
                                
                                {/* Preview of selected template */}
                                {selectedTemplate && (
                                    <MuiBox 
                                        sx={{ 
                                            mt: 1, 
                                            p: 2, 
                                            borderRadius: '12px', 
                                            border: '1px solid var(--color-border-glass)',
                                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                borderColor: 'var(--color-primary-500)',
                                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            }
                                        }}
                                    >
                                        <MuiBox sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                            {selectedTemplateImageUrl ? (
                                                <img 
                                                    src={selectedTemplateImageUrl} 
                                                    alt={selectedTemplate.templateName || ''}
                                                    style={{ 
                                                        width: 120, 
                                                        height: 120, 
                                                        objectFit: 'cover', 
                                                        borderRadius: '8px',
                                                        border: '1px solid var(--color-border-glass)',
                                                        flexShrink: 0
                                                    }}
                                                />
                                            ) : (
                                                <MuiBox 
                                                    sx={{ 
                                                        width: 120, 
                                                        height: 120, 
                                                        borderRadius: '8px',
                                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                        border: '1px solid var(--color-border-glass)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0
                                                    }}
                                                >
                                                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', textAlign: 'center', px: 1 }}>
                                                        بدون صورة
                                                    </MuiTypography>
                                                </MuiBox>
                                            )}
                                            <MuiBox sx={{ flex: 1, minWidth: 0 }}>
                                                <MuiTypography 
                                                    variant="body1" 
                                                    sx={{ 
                                                        fontWeight: 600, 
                                                        mb: 1,
                                                        color: 'var(--color-text-primary)',
                                                        fontSize: '1rem'
                                                    }}
                                                >
                                                    {selectedTemplate.templateName || selectedTemplate.name || 'قالب بدون اسم'}
                                                </MuiTypography>
                                                {selectedTemplate.description ? (
                                                    <MuiTypography 
                                                        variant="body2" 
                                                        sx={{ 
                                                            color: 'var(--color-text-secondary)',
                                                            lineHeight: 1.6,
                                                            whiteSpace: 'pre-wrap',
                                                            wordBreak: 'break-word'
                                                        }}
                                                    >
                                                        {selectedTemplate.description}
                                                    </MuiTypography>
                                                ) : (
                                                    <MuiTypography 
                                                        variant="caption" 
                                                        sx={{ 
                                                            color: 'var(--color-text-secondary)',
                                                            fontStyle: 'italic'
                                                        }}
                                                    >
                                                        لا يوجد وصف
                                                    </MuiTypography>
                                                )}
                                            </MuiBox>
                                        </MuiBox>
                                    </MuiBox>
                                )}
                            </MuiBox>
                        )
                    })}

                    {templateFields.length === 0 && (
                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                            لا توجد قوالب مضافة. اضغط على "إضافة قالب" لإضافة قالب.
                        </MuiTypography>
                    )}
                </MuiGrid>

                {/* Images */}
                <MuiGrid item xs={12}>
                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, mt: 1, color: 'var(--color-primary-500)' }}>
                        الصور
                    </MuiTypography>

                    <MuiGrid container spacing={2}>
                        {/* Primary Image */}
                        <MuiGrid item xs={12} md={4}>
                            <MuiTypography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>الصورة الرئيسية</MuiTypography>
                            <MuiBox
                                sx={{
                                    border: '2px dashed var(--color-border-glass)',
                                    borderRadius: '8px',
                                    p: 2,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    height: '160px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                    '&:hover': {
                                        borderColor: 'var(--color-primary-500)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    }
                                }}
                                onClick={() => document.getElementById('primary-image-input').click()}
                            >
                                <input
                                    id="primary-image-input"
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handlePrimaryImageChange}
                                />
                                {primaryImage ? (
                                    <img src={URL.createObjectURL(primaryImage)} alt="Primary" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : editingHall?.primaryImage ? (
                                    <img src={getImageUrl(getHallImagePath(editingHall.primaryImage))} alt="Primary" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <>
                                        <UploadCloud size={32} style={{ color: 'var(--color-text-secondary)', marginBottom: 8 }} />
                                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>اضغط للرفع</MuiTypography>
                                    </>
                                )}
                            </MuiBox>
                        </MuiGrid>

                        {/* Gallery Images */}
                        <MuiGrid item xs={12} md={8}>
                            <MuiTypography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>صور المعرض</MuiTypography>
                            <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                <MuiBox
                                    sx={{
                                        width: 96,
                                        height: 96,
                                        border: '2px dashed var(--color-border-glass)',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                        '&:hover': {
                                            borderColor: 'var(--color-primary-500)',
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        }
                                    }}
                                    onClick={() => document.getElementById('gallery-images-input').click()}
                                >
                                    <input
                                        id="gallery-images-input"
                                        type="file"
                                        hidden
                                        multiple
                                        accept="image/*"
                                        onChange={handleGalleryImagesChange}
                                    />
                                    <Plus className="text-gray-400" />
                                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>إضافة</MuiTypography>
                                </MuiBox>

                                {galleryImages.map((file, index) => (
                                    <MuiBox key={index} sx={{ width: 96, height: 96, position: 'relative', borderRadius: '8px', overflow: 'hidden', '&:hover .delete-overlay': { opacity: 1 } }}>
                                        <img src={URL.createObjectURL(file)} alt={`Gallery ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <MuiBox
                                            className="delete-overlay"
                                            sx={{
                                                position: 'absolute',
                                                inset: 0,
                                                backgroundColor: 'rgba(0,0,0,0.5)',
                                                opacity: 0,
                                                transition: 'opacity 0.2s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <MuiIconButton size="small" sx={{ color: 'white' }} onClick={() => removeGalleryImage(index)}>
                                                <X size={16} />
                                            </MuiIconButton>
                                        </MuiBox>
                                    </MuiBox>
                                ))}

                                {existingGalleryImages.map((img, index) => (
                                    <MuiBox key={`existing-${index}`} sx={{ width: 96, height: 96, position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                                        <img src={getImageUrl(getHallImagePath(img))} alt={`Existing ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </MuiBox>
                                ))}
                            </MuiBox>
                        </MuiGrid>
                    </MuiGrid>
                </MuiGrid>

            </MuiGrid>
        </FormDialog>
    )
}
