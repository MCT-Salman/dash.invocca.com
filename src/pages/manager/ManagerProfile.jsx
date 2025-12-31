// src/pages/manager/ManagerProfile.jsx
/**
 * Manager Profile Page
 * الملف الشخصي للمدير
 */

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
import MuiCard from '@/components/ui/MuiCard'
import MuiCardContent from '@/components/ui/MuiCardContent'
import MuiDialog from '@/components/ui/MuiDialog'
import MuiDialogTitle from '@/components/ui/MuiDialogTitle'
import MuiDialogContent from '@/components/ui/MuiDialogContent'
import MuiDialogActions from '@/components/ui/MuiDialogActions'
import { SEOHead, ButtonLoading } from '@/components/common'
import { VALIDATION } from '@/config/constants'
import { updateProfile } from '@/api/auth'
import { useAuth, useNotification } from '@/hooks'
import { User, Phone, Lock, Save, Edit, Camera, Settings, Shield, Briefcase, Activity, Building2, Globe, X } from 'lucide-react'

// Validation Schemas
const profileSchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب').min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  phone: z.string().min(1, 'رقم الهاتف مطلوب').regex(/^\d+$/, 'رقم الهاتف يجب أن يكون أرقام فقط'),
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

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  })

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      success('تم تحديث الملف الشخصي بنجاح')
      setEditDialogOpen(false)
    },
    onError: (err) => {
      showError(err.message || 'حدث خطأ أثناء تحديث الملف الشخصي')
    },
  })

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data) => updateProfile({ password: data.newPassword }),
    onSuccess: () => {
      success('تم تغيير كلمة المرور بنجاح')
      resetPassword()
    },
    onError: (err) => {
      showError(err.message || 'حدث خطأ أثناء تغيير كلمة المرور')
    },
  })

  const onSubmitProfile = (data) => {
    updateProfileMutation.mutate(data)
  }

  const onSubmitPassword = (data) => {
    changePasswordMutation.mutate(data)
  }

  return (
    <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh' }}>
      <SEOHead pageKey="managerProfile" title="الملف الشخصي | INVOCCA" />

      {/* Header */}
      <MuiBox sx={{ mb: 4, textAlign: 'center' }}>
        <MuiTypography variant="h3" sx={{ 
          fontWeight: 800, 
          color: 'var(--color-text-primary-dark)', 
          mb: 1,
          background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          الملف الشخصي
        </MuiTypography>
        <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
          إدارة معلوماتك الشخصية وإعدادات النظام
        </MuiTypography>
      </MuiBox>

      {/* Profile Card */}
      <MuiPaper
        elevation={0}
        sx={{
          p: 4,
          background: 'var(--color-surface-dark)',
          border: '1px solid var(--color-border-glass)',
          borderRadius: '24px',
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(216, 185, 138, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
          }
        }}
      >
        <MuiBox sx={{ position: 'relative', zIndex: 1 }}>
          {/* Profile Header */}
          <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <MuiBox sx={{ position: 'relative' }}>
                <MuiAvatar
                  src={user?.avatar}
                  alt={user?.name}
                  sx={{
                    width: 100,
                    height: 100,
                    border: '3px solid var(--color-primary-500)',
                    boxShadow: '0 8px 24px rgba(216, 185, 138, 0.3)',
                  }}
                >
                  <User size={50} style={{ color: 'var(--color-primary-500)' }} />
                </MuiAvatar>
                <MuiBox
                  sx={{
                    position: 'absolute',
                    bottom: -5,
                    right: -5,
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--color-surface-dark)',
                  }}
                >
                  <Briefcase size={16} style={{ color: '#fff' }} />
                </MuiBox>
              </MuiBox>
              <MuiBox>
                <MuiTypography variant="h4" sx={{ 
                  color: 'var(--color-text-primary-dark)', 
                  fontWeight: 700,
                  mb: 0.5
                }}>
                  {user?.name}
                </MuiTypography>
                <MuiTypography variant="body1" sx={{ 
                  color: 'var(--color-primary-300)', 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Shield size={16} />
                  مدير صالة
                </MuiTypography>
              </MuiBox>
            </MuiBox>
            <MuiButton
              variant="contained"
              onClick={() => setEditDialogOpen(true)}
              startIcon={<Edit size={18} />}
              sx={{
                borderRadius: '12px',
                px: 3,
                background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                color: '#1A1A1A',
                boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)',
              }}
            >
              تعديل الملف
            </MuiButton>
          </MuiBox>

          <MuiDivider sx={{ borderColor: 'var(--color-border-glass)', mb: 4 }} />

          {/* Profile Information Display */}
          <MuiGrid container spacing={3}>
            {/* Name */}
            <MuiGrid item xs={12} md={6}>
              <MuiBox>
                <MuiTypography variant="caption" sx={{ 
                  color: 'var(--color-text-secondary)', 
                  mb: 1, 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}>
                  <User size={14} />
                  الاسم الكامل
                </MuiTypography>
                <MuiCard sx={{ 
                  background: 'rgba(216, 185, 138, 0.1)',
                  border: '1px solid rgba(216, 185, 138, 0.2)',
                  borderRadius: '12px'
                }}>
                  <MuiCardContent sx={{ py: 2 }}>
                    <MuiTypography variant="body1" sx={{ 
                      fontWeight: 600, 
                      color: 'var(--color-text-primary-dark)' 
                    }}>
                      {user?.name}
                    </MuiTypography>
                  </MuiCardContent>
                </MuiCard>
              </MuiBox>
            </MuiGrid>

            {/* Phone */}
            <MuiGrid item xs={12} md={6}>
              <MuiBox>
                <MuiTypography variant="caption" sx={{ 
                  color: 'var(--color-text-secondary)', 
                  mb: 1, 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}>
                  <Phone size={14} />
                  رقم الهاتف
                </MuiTypography>
                <MuiCard sx={{ 
                  background: 'rgba(216, 185, 138, 0.1)',
                  border: '1px solid rgba(216, 185, 138, 0.2)',
                  borderRadius: '12px'
                }}>
                  <MuiCardContent sx={{ py: 2 }}>
                    <MuiTypography variant="body1" sx={{ 
                      fontWeight: 600, 
                      color: 'var(--color-text-primary-dark)' 
                    }}>
                      {user?.phone}
                    </MuiTypography>
                  </MuiCardContent>
                </MuiCard>
              </MuiBox>
            </MuiGrid>

            {/* Role */}
            <MuiGrid item xs={12} md={6}>
              <MuiBox>
                <MuiTypography variant="caption" sx={{ 
                  color: 'var(--color-text-secondary)', 
                  mb: 1, 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}>
                  <Shield size={14} />
                  الدور
                </MuiTypography>
                <MuiCard sx={{ 
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '12px'
                }}>
                  <MuiCardContent sx={{ py: 2 }}>
                    <MuiTypography variant="body1" sx={{ 
                      fontWeight: 600, 
                      color: 'var(--color-text-primary-dark)' 
                    }}>
                      {user?.role === 'manager' ? 'مدير صالة' : user?.role}
                    </MuiTypography>
                  </MuiCardContent>
                </MuiCard>
              </MuiBox>
            </MuiGrid>

            {/* Hall */}
            <MuiGrid item xs={12} md={6}>
              <MuiBox>
                <MuiTypography variant="caption" sx={{ 
                  color: 'var(--color-text-secondary)', 
                  mb: 1, 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}>
                  <Building2 size={14} />
                  القاعة
                </MuiTypography>
                <MuiCard sx={{ 
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '12px'
                }}>
                  <MuiCardContent sx={{ py: 2 }}>
                    <MuiTypography variant="body1" sx={{ 
                      fontWeight: 600, 
                      color: 'var(--color-text-primary-dark)' 
                    }}>
                      {user?.hall?.name || '—'}
                    </MuiTypography>
                  </MuiCardContent>
                </MuiCard>
              </MuiBox>
            </MuiGrid>

            {/* Status */}
            <MuiGrid item xs={12} md={6}>
              <MuiBox>
                <MuiTypography variant="caption" sx={{ 
                  color: 'var(--color-text-secondary)', 
                  mb: 1, 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}>
                  <Globe size={14} />
                  الحالة
                </MuiTypography>
                <MuiCard sx={{ 
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  borderRadius: '12px'
                }}>
                  <MuiCardContent sx={{ py: 2 }}>
                    <MuiTypography variant="body1" sx={{ 
                      fontWeight: 600, 
                      color: 'var(--color-text-primary-dark)' 
                    }}>
                      {user?.isActive ? 'نشط' : 'غير نشط'}
                    </MuiTypography>
                  </MuiCardContent>
                </MuiCard>
              </MuiBox>
            </MuiGrid>

            {/* Language */}
            <MuiGrid item xs={12} md={6}>
              <MuiBox>
                <MuiTypography variant="caption" sx={{ 
                  color: 'var(--color-text-secondary)', 
                  mb: 1, 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}>
                  <Settings size={14} />
                  اللغة
                </MuiTypography>
                <MuiCard sx={{ 
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.2)',
                  borderRadius: '12px'
                }}>
                  <MuiCardContent sx={{ py: 2 }}>
                    <MuiTypography variant="body1" sx={{ 
                      fontWeight: 600, 
                      color: 'var(--color-text-primary-dark)' 
                    }}>
                      {user?.settings?.language === 'ar' ? 'العربية' : 'English'}
                    </MuiTypography>
                  </MuiCardContent>
                </MuiCard>
              </MuiBox>
            </MuiGrid>
          </MuiGrid>
        </MuiBox>
      </MuiPaper>

      {/* Manager Stats */}
      <MuiGrid container spacing={3} mb={6}>
        <MuiGrid item xs={12} sm={6} md={3}>
          <MuiCard sx={{ 
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '16px',
            textAlign: 'center',
            p: 3
          }}>
            <MuiBox sx={{ 
              width: 48, 
              height: 48, 
              borderRadius: '12px', 
              background: 'rgba(59, 130, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2
            }}>
              <Briefcase size={24} style={{ color: '#3b82f6' }} />
            </MuiBox>
            <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
              مدير
            </MuiTypography>
            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
              الصلاحية
            </MuiTypography>
          </MuiCard>
        </MuiGrid>

        <MuiGrid item xs={12} sm={6} md={3}>
          <MuiCard sx={{ 
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: '16px',
            textAlign: 'center',
            p: 3
          }}>
            <MuiBox sx={{ 
              width: 48, 
              height: 48, 
              borderRadius: '12px', 
              background: 'rgba(34, 197, 94, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2
            }}>
              <Building2 size={24} style={{ color: '#22c55e' }} />
            </MuiBox>
            <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
              {user?.hall?.name ? 'قاعة' : '—'}
            </MuiTypography>
            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
              القاعة
            </MuiTypography>
          </MuiCard>
        </MuiGrid>

        <MuiGrid item xs={12} sm={6} md={3}>
          <MuiCard sx={{ 
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '16px',
            textAlign: 'center',
            p: 3
          }}>
            <MuiBox sx={{ 
              width: 48, 
              height: 48, 
              borderRadius: '12px', 
              background: 'rgba(59, 130, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2
            }}>
              <Globe size={24} style={{ color: '#3b82f6' }} />
            </MuiBox>
            <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
              نشط
            </MuiTypography>
            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
              الحالة
            </MuiTypography>
          </MuiCard>
        </MuiGrid>

        <MuiGrid item xs={12} sm={6} md={3}>
          <MuiCard sx={{ 
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(168, 85, 247, 0.05))',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            borderRadius: '16px',
            textAlign: 'center',
            p: 3
          }}>
            <MuiBox sx={{ 
              width: 48, 
              height: 48, 
              borderRadius: '12px', 
              background: 'rgba(168, 85, 247, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2
            }}>
              <Activity size={24} style={{ color: '#a855f7' }} />
            </MuiBox>
            <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
              نشط
            </MuiTypography>
            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
              الحساب
            </MuiTypography>
          </MuiCard>
        </MuiGrid>
      </MuiGrid>

      {/* Change Password */}
      <MuiPaper
        sx={{
          p: 4,
          borderRadius: '24px',
          border: '1px solid var(--color-border-glass)',
          background: 'var(--color-surface-dark)',
          position: 'relative',
          overflow: 'hidden',
          marginTop: '2rem',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
            borderRadius: '50%',
          }
        }}
      >
        <MuiBox sx={{ position: 'relative', zIndex: 1 }}>
          <MuiTypography variant="h6" sx={{ 
            fontWeight: 'bold', 
            color: 'var(--color-text-primary-dark)', 
            mb: 3, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1 
          }}>
            <Lock size={24} style={{ color: 'var(--color-primary-500)' }} />
            تغيير كلمة المرور
          </MuiTypography>

          <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
            <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Current Password */}
              <MuiTextField
                {...registerPassword('currentPassword')}
                label="كلمة المرور الحالية"
                type="password"
                fullWidth
                error={!!passwordErrors.currentPassword}
                helperText={passwordErrors.currentPassword?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              />

              <MuiDivider sx={{ borderColor: 'var(--color-border-glass)' }} />

              {/* New Password */}
              <MuiTextField
                {...registerPassword('newPassword')}
                label="كلمة المرور الجديدة"
                type="password"
                fullWidth
                error={!!passwordErrors.newPassword}
                helperText={passwordErrors.newPassword?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              />

              {/* Confirm Password */}
              <MuiTextField
                {...registerPassword('confirmPassword')}
                label="تأكيد كلمة المرور الجديدة"
                type="password"
                fullWidth
                error={!!passwordErrors.confirmPassword}
                helperText={passwordErrors.confirmPassword?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              />

              <MuiButton
                type="submit"
                variant="contained"
                disabled={changePasswordMutation.isPending}
                startIcon={changePasswordMutation.isPending ? <ButtonLoading /> : <Lock size={18} />}
                sx={{
                  alignSelf: 'flex-start',
                  borderRadius: '12px',
                  px: 4,
                  background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                  color: '#1A1A1A',
                  boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)',
                  mt: 1
                }}
              >
                {changePasswordMutation.isPending ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
              </MuiButton>
            </MuiBox>
          </form>
        </MuiBox>
      </MuiPaper>

      {/* Edit Profile Dialog */}
      <MuiDialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <MuiDialogTitle sx={{ 
          background: 'var(--color-surface-dark)',
          color: 'var(--color-text-primary-dark)',
          borderBottom: '1px solid var(--color-border-glass)'
        }}>
          <MuiTypography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Edit size={20} />
            تعديل الملف الشخصي
          </MuiTypography>
        </MuiDialogTitle>
        
        <MuiDialogContent sx={{ 
          background: 'var(--color-surface-dark)',
          color: 'var(--color-text-primary-dark)',
          p: 5,
          mt: 3
        }}>
          <form onSubmit={handleSubmitProfile((data) => {
            updateProfileMutation.mutate(data)
            setEditDialogOpen(false)
          })}>
            <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <MuiTextField
                {...registerProfile('name')}
                label="الاسم الكامل"
                fullWidth
                defaultValue={user?.name || ''}
                error={!!profileErrors.name}
                helperText={profileErrors.name?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              />
              
              <MuiTextField
                {...registerProfile('phone')}
                label="رقم الهاتف"
                fullWidth
                defaultValue={user?.phone || ''}
                error={!!profileErrors.phone}
                helperText={profileErrors.phone?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              />
            </MuiBox>
          </form>
        </MuiDialogContent>
        
        <MuiDialogActions sx={{ 
          background: 'var(--color-surface-dark)',
          borderTop: '1px solid var(--color-border-glass)',
          p: 3
        }}>
          <MuiButton
            onClick={() => setEditDialogOpen(false)}
            sx={{
              color: 'var(--color-text-secondary)',
              borderColor: 'var(--color-border-glass)',
            }}
          >
            إلغاء
          </MuiButton>
          <MuiButton
            onClick={() => {
              handleSubmitProfile((data) => {
                updateProfileMutation.mutate(data)
                setEditDialogOpen(false)
              })()
            }}
            variant="contained"
            disabled={updateProfileMutation.isPending}
            startIcon={updateProfileMutation.isPending ? <ButtonLoading /> : <Save size={18} />}
            sx={{
              background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
              color: '#1A1A1A',
              boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)',
            }}
          >
            {updateProfileMutation.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </MuiButton>
        </MuiDialogActions>
      </MuiDialog>
    </MuiBox>
  )
}
