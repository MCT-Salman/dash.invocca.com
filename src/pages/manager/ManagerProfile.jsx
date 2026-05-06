// src\pages\manager\ManagerProfile.jsx
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiButton from '@/components/ui/MuiButton'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiDivider from '@/components/ui/MuiDivider'
import MuiAvatar from '@/components/ui/MuiAvatar'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiDialog from '@/components/ui/MuiDialog'
import MuiDialogTitle from '@/components/ui/MuiDialogTitle'
import MuiDialogContent from '@/components/ui/MuiDialogContent'
import MuiDialogActions from '@/components/ui/MuiDialogActions'
import { SEOHead, ButtonLoading } from '@/components/common'
import { updateProfile } from '@/api/auth'
import { useAuth, useNotification } from '@/hooks'
import { User, Phone, Lock, Save, Edit, Shield } from 'lucide-react'

const profileSchema = z.object({
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  phone: z.string().min(1, 'رقم الهاتف مطلوب').regex(/^\d+$/, 'رقم الهاتف يجب أن يحتوي أرقاماً فقط'),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
  newPassword: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
})

export default function ManagerProfile() {
  const { user } = useAuth()
  const { success, error: showError } = useNotification()
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const { register: registerProfile, handleSubmit: handleSubmitProfile, formState: { errors: profileErrors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', phone: user?.phone || '' }
  })

  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: passwordErrors }, reset: resetPassword } = useForm({
    resolver: zodResolver(passwordSchema),
  })

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      success('تم تحديث الملف الشخصي بنجاح')
      setEditDialogOpen(false)
    },
    onError: (err) => showError(err.message || 'حدث خطأ أثناء التحديث'),
  })

  const changePasswordMutation = useMutation({
    mutationFn: (data) => updateProfile({ password: data.newPassword }),
    onSuccess: () => {
      success('تم تغيير كلمة المرور بنجاح')
      resetPassword()
    },
    onError: (err) => showError(err.message || 'حدث خطأ أثناء تغيير كلمة المرور'),
  })

  return (
    <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
      <SEOHead title="الملف الشخصي | INVOCCA" />

      <MuiBox sx={{ mb: 4, textAlign: 'center' }}>
        <MuiTypography variant="h3" sx={{ fontWeight: 800, color: 'var(--color-icon)', mb: 1 }}>الملف الشخصي</MuiTypography>
        <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>إدارة معلوماتك الشخصية وإعدادات الحساب</MuiTypography>
      </MuiBox>

      <MuiPaper sx={{ p: 4, borderRadius: '24px', background: 'var(--color-paper)', border: '1px solid var(--color-border)', mb: 4 }}>
        <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <MuiAvatar sx={{ width: 80, height: 80, border: '3px solid var(--color-icon)', bgcolor: 'transparent' }}>
              <User size={40} style={{ color: 'var(--color-icon)' }} />
            </MuiAvatar>
            <MuiBox>
              <MuiTypography variant="h5" sx={{ fontWeight: 700 }}>{user?.name}</MuiTypography>
              <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Shield size={14} /> مدير قاعة
              </MuiTypography>
            </MuiBox>
          </MuiBox>
          <MuiButton variant="contained" onClick={() => setEditDialogOpen(true)} startIcon={<Edit size={18} />} sx={{ borderRadius: '12px' }}>تعديل الملف</MuiButton>
        </MuiBox>

        <MuiDivider sx={{ mb: 4 }} />

        <MuiGrid container spacing={4}>
          <MuiGrid item xs={12} md={6}>
            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 1 }}>الاسم الكامل</MuiTypography>
            <MuiTypography variant="body1" sx={{ fontWeight: 600 }}>{user?.name}</MuiTypography>
          </MuiGrid>
          <MuiGrid item xs={12} md={6}>
            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 1 }}>رقم الهاتف</MuiTypography>
            <MuiTypography variant="body1" sx={{ fontWeight: 600 }}>{user?.phone}</MuiTypography>
          </MuiGrid>
        </MuiGrid>
      </MuiPaper>

      <MuiPaper sx={{ p: 4, borderRadius: '24px', background: 'var(--color-paper)', border: '1px solid var(--color-border)' }}>
        <MuiTypography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Lock size={20} color="var(--color-icon)" /> تغيير كلمة المرور
        </MuiTypography>
        <form onSubmit={handleSubmitPassword(onSubmitPassword => changePasswordMutation.mutate(onSubmitPassword))}>
          <MuiGrid container spacing={3}>
            <MuiGrid item xs={12} md={4}>
              <MuiTextField {...registerPassword('currentPassword')} label="كلمة المرور الحالية" type="password" fullWidth error={!!passwordErrors.currentPassword} helperText={passwordErrors.currentPassword?.message} />
            </MuiGrid>
            <MuiGrid item xs={12} md={4}>
              <MuiTextField {...registerPassword('newPassword')} label="كلمة المرور الجديدة" type="password" fullWidth error={!!passwordErrors.newPassword} helperText={passwordErrors.newPassword?.message} />
            </MuiGrid>
            <MuiGrid item xs={12} md={4}>
              <MuiTextField {...registerPassword('confirmPassword')} label="تأكيد كلمة المرور الجديدة" type="password" fullWidth error={!!passwordErrors.confirmPassword} helperText={passwordErrors.confirmPassword?.message} />
            </MuiGrid>
            <MuiGrid item xs={12}>
              <MuiButton type="submit" variant="contained" disabled={changePasswordMutation.isPending} sx={{ borderRadius: '12px', px: 4 }}>
                {changePasswordMutation.isPending ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
              </MuiButton>
            </MuiGrid>
          </MuiGrid>
        </form>
      </MuiPaper>

      <MuiDialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="xs">
        <MuiDialogTitle sx={{ fontWeight: 700 }}>تعديل الملف الشخصي</MuiDialogTitle>
        <form onSubmit={handleSubmitProfile(data => updateProfileMutation.mutate(data))}>
          <MuiDialogContent>
            <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
              <MuiTextField {...registerProfile('name')} label="الاسم الكامل" fullWidth error={!!profileErrors.name} helperText={profileErrors.name?.message} />
              <MuiTextField {...registerProfile('phone')} label="رقم الهاتف" fullWidth error={!!profileErrors.phone} helperText={profileErrors.phone?.message} />
            </MuiBox>
          </MuiDialogContent>
          <MuiDialogActions sx={{ p: 3 }}>
            <MuiButton onClick={() => setEditDialogOpen(false)}>إلغاء</MuiButton>
            <MuiButton type="submit" variant="contained" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </MuiButton>
          </MuiDialogActions>
        </form>
      </MuiDialog>
    </MuiBox>
  )
}
