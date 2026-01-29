import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiTypography from '@/components/ui/MuiTypography'
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
    }
  }, [open, reset])

  const handleFormSubmit = (data) => {
    onSubmit(data)
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
      </MuiGrid>
    </FormDialog>
  )
}
