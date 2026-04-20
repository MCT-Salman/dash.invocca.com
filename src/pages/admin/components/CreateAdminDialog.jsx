import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiBox from '@/components/ui/MuiBox'
import { FormDialog } from '@/components/common'
import { useNotification } from '@/hooks'

const createAdminSchema = z.object({
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل').max(100, 'الاسم طويل جداً'),
  username: z.string().min(3, 'اسم المستخدم مطلوب').regex(/^[a-zA-Z0-9_]+$/, 'اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام فقط'),
  phone: z.string().regex(/^\d+$/, 'رقم الهاتف يجب أن يكون أرقام فقط').min(6, 'رقم الهاتف يجب أن يكون 6 أرقام على الأقل').max(15, 'رقم الهاتف طويل جداً'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
})

export default function CreateAdminDialog({ open, onClose, onSubmit, loading }) {
  const { addNotification: showNotification } = useNotification()
  const [previewImage, setPreviewImage] = useState(null)

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      name: '',
      username: '',
      phone: '',
      password: ''
    }
  })

  useEffect(() => {
    if (open) {
      reset({ name: '', username: '', phone: '', password: '' })
      setPreviewImage(null)
    }
  }, [open, reset])

  const handleFormSubmit = (data) => {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== '') {
            formData.append(key, data[key])
        }
    })
    if (previewImage) {
        formData.append('image', previewImage)
    }
    // Also send role as admin since this is CreateAdminDialog
    formData.append('role', 'admin')
    
    onSubmit(formData)
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB Limit
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
      title="إضافة مدير نظام جديد"
      onSubmit={handleSubmit(handleFormSubmit, (errors) => {
        const firstError = Object.values(errors)[0]
        showNotification({
          title: 'بيانات غير مكتملة',
          message: firstError?.message || 'يرجى التحقق من الحقول المطلوبة',
          type: 'error'
        })
      })}
      loading={loading}
      submitText="إضافة"
      cancelText="إلغاء"
      maxWidth="sm"
    >
      <MuiGrid container spacing={3}>
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
                label="الاسم الكامل"
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
                placeholder="مثال: admin123"
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

        <MuiGrid item xs={12}>
            <MuiTypography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'var(--color-primary-500)' }}>
                صورة المستخدم
            </MuiTypography>
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
                        id="user-image-upload"
                    />
                    <label htmlFor="user-image-upload">
                        <MuiBox sx={{ cursor: 'pointer' }}>
                            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                انقر لرفع صورة أو اسحب وأفلت
                            </MuiTypography>
                            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                (PNG, JPG - الحد الأقصى 5MB)
                            </MuiTypography>
                        </MuiBox>
                    </label>
                </MuiBox>

                {previewImage && (
                    <MuiBox sx={{ position: 'relative', display: 'inline-block' }}>
                        <img
                            src={URL.createObjectURL(previewImage)}
                            alt="Preview"
                            style={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'cover',
                                borderRadius: '50%',
                                border: '2px solid var(--color-primary-500)'
                            }}
                        />
                        <MuiBox
                            onClick={removeImage}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                backgroundColor: 'rgba(239, 68, 68, 0.9)',
                                color: 'var(--color-text-primary)',
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                '&:hover': { backgroundColor: 'rgba(220, 38, 38, 1)' }
                            }}
                        >
                            <span style={{ fontSize: '14px', lineHeight: 1 }}>×</span>
                        </MuiBox>
                    </MuiBox>
                )}
            </MuiBox>
        </MuiGrid>
      </MuiGrid>
    </FormDialog>

  )
}
