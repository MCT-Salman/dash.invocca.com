// src/pages/client/ClientProfile.jsx
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
import { SEOHead, ButtonLoading } from '@/components/common'
import { VALIDATION } from '@/config/constants'
import { updateProfile } from '@/api/auth'
import { useAuth, useNotification } from '@/hooks'
import { User, Phone, Mail, Calendar, MapPin, Save, Edit, Camera, Settings, Shield, Star, X } from 'lucide-react'

// Validation Schema
const profileSchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب').min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  phone: z.string().min(1, 'رقم الهاتف مطلوب').regex(/^\d+$/, 'رقم الهاتف يجب أن يكون أرقام فقط'),
  email: z.string().optional(),
})

export default function ClientProfile() {
    const { user } = useAuth()
    const { success, error: showError } = useNotification()
    const [editingProfile, setEditingProfile] = useState(false)
    const [activeTab, setActiveTab] = useState('profile')

    // Profile form
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: profileErrors },
        reset: resetProfile,
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || '',
            phone: user?.phone || '',
            email: user?.email || '',
        },
    })

    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            success('تم تحديث الملف الشخصي بنجاح')
            setEditingProfile(false)
        },
        onError: (err) => {
            showError(err.message || 'حدث خطأ أثناء تحديث الملف الشخصي')
        },
    })

    const onSubmitProfile = (data) => {
        updateProfileMutation.mutate(data)
    }

    const handleEditToggle = () => {
        if (editingProfile) {
            resetProfile({
                name: user?.name || '',
                phone: user?.phone || '',
                email: user?.email || '',
            })
        }
        setEditingProfile(!editingProfile)
    }

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh' }}>
            <SEOHead title="الملف الشخصي - INVOCCA" />

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
                    إدارة معلوماتك الشخصية والاحتفاظ بها محدثة
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
                    mb: 4,
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
                                {editingProfile && (
                                    <MuiButton
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            bottom: -5,
                                            right: -5,
                                            width: 36,
                                            height: 36,
                                            borderRadius: '50%',
                                            minWidth: 'auto',
                                            p: 0,
                                            background: 'var(--color-primary-500)',
                                            border: '2px solid var(--color-surface-dark)',
                                        }}
                                    >
                                        <Camera size={16} />
                                    </MuiButton>
                                )}
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
                                    <Star size={16} />
                                    عميل مميز
                                </MuiTypography>
                            </MuiBox>
                        </MuiBox>
                        <MuiButton
                            variant={editingProfile ? "outlined" : "contained"}
                            onClick={handleEditToggle}
                            startIcon={editingProfile ? <X size={18} /> : <Edit size={18} />}
                            sx={{
                                borderRadius: '12px',
                                px: 3,
                                ...(editingProfile ? {
                                    borderColor: 'var(--color-border-glass)',
                                    color: 'var(--color-text-secondary)',
                                } : {
                                    background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                                    color: '#1A1A1A',
                                    boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)',
                                })
                            }}
                        >
                            {editingProfile ? 'إلغاء' : 'تعديل الملف'}
                        </MuiButton>
                    </MuiBox>

                    <MuiDivider sx={{ borderColor: 'var(--color-border-glass)', mb: 4 }} />

                    {/* Profile Form */}
                    <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
                        <MuiGrid container spacing={3}>
                            {/* Name Field */}
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
                                    {editingProfile ? (
                                        <MuiTextField
                                            {...registerProfile('name')}
                                            fullWidth
                                            error={!!profileErrors.name}
                                            helperText={profileErrors.name?.message}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '12px',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                }
                                            }}
                                        />
                                    ) : (
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
                                    )}
                                </MuiBox>
                            </MuiGrid>

                            {/* Phone Field */}
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
                                    {editingProfile ? (
                                        <MuiTextField
                                            {...registerProfile('phone')}
                                            fullWidth
                                            error={!!profileErrors.phone}
                                            helperText={profileErrors.phone?.message}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '12px',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                }
                                            }}
                                        />
                                    ) : (
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
                                    )}
                                </MuiBox>
                            </MuiGrid>

                            {/* Email Field */}
                            <MuiGrid item xs={12} md={6}>
                                <MuiBox>
                                    <MuiTypography variant="caption" sx={{ 
                                        color: 'var(--color-text-secondary)', 
                                        mb: 1, 
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5
                                    }}>
                                        <Mail size={14} />
                                        البريد الإلكتروني
                                    </MuiTypography>
                                    {editingProfile ? (
                                        <MuiTextField
                                            {...registerProfile('email')}
                                            fullWidth
                                            error={!!profileErrors.email}
                                            helperText={profileErrors.email?.message}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '12px',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                }
                                            }}
                                        />
                                    ) : (
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
                                                    {user?.email || '—'}
                                                </MuiTypography>
                                            </MuiCardContent>
                                        </MuiCard>
                                    )}
                                </MuiBox>
                            </MuiGrid>

                            {/* Member Since */}
                            <MuiGrid item xs={12} md={6}>
                                <MuiBox>
                                    <MuiTypography variant="caption" sx={{ 
                                        color: 'var(--color-text-secondary)', 
                                        mb: 1, 
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5
                                    }}>
                                        <Calendar size={14} />
                                        تاريخ الانضمام
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
                                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-SA') : '—'}
                                            </MuiTypography>
                                        </MuiCardContent>
                                    </MuiCard>
                                </MuiBox>
                            </MuiGrid>
                        </MuiGrid>

                        {editingProfile && (
                            <MuiBox sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
                                <MuiButton
                                    type="submit"
                                    variant="contained"
                                    disabled={updateProfileMutation.isPending}
                                    startIcon={updateProfileMutation.isPending ? <ButtonLoading /> : <Save size={18} />}
                                    sx={{
                                        borderRadius: '12px',
                                        px: 4,
                                        background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                                        color: '#1A1A1A',
                                        boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)',
                                    }}
                                >
                                    {updateProfileMutation.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                                </MuiButton>
                            </MuiBox>
                        )}
                    </form>
                </MuiBox>
            </MuiPaper>

            {/* Quick Stats */}
            <MuiGrid container spacing={3}>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <MuiCard sx={{ 
                        background: 'linear-gradient(135deg, rgba(216, 185, 138, 0.1), rgba(216, 185, 138, 0.05))',
                        border: '1px solid rgba(216, 185, 138, 0.2)',
                        borderRadius: '16px',
                        textAlign: 'center',
                        p: 3
                    }}>
                        <MuiBox sx={{ 
                            width: 48, 
                            height: 48, 
                            borderRadius: '12px', 
                            background: 'rgba(216, 185, 138, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2
                        }}>
                            <Calendar size={24} style={{ color: 'var(--color-primary-500)' }} />
                        </MuiBox>
                        <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                            {user?.bookingsCount || 0}
                        </MuiTypography>
                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                            الحجوزات
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
                            <Star size={24} style={{ color: '#22c55e' }} />
                        </MuiBox>
                        <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                            {user?.rating || 5.0}
                        </MuiTypography>
                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                            التقييم
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
                            <Shield size={24} style={{ color: '#3b82f6' }} />
                        </MuiBox>
                        <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                            موثق
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
                            <Settings size={24} style={{ color: '#a855f7' }} />
                        </MuiBox>
                        <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                            كامل
                        </MuiTypography>
                        <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                            الملف
                        </MuiTypography>
                    </MuiCard>
                </MuiGrid>
            </MuiGrid>
        </MuiBox>
    )
}
