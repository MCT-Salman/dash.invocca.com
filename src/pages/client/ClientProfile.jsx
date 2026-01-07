// src/pages/client/ClientProfile.jsx
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiDivider from '@/components/ui/MuiDivider'
import MuiAvatar from '@/components/ui/MuiAvatar'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiCard from '@/components/ui/MuiCard'
import MuiCardContent from '@/components/ui/MuiCardContent'
import { SEOHead } from '@/components/common'
import { useAuth } from '@/hooks'
import { User, Phone, Shield, Star } from 'lucide-react'

export default function ClientProfile() {
    const { user } = useAuth()

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
                    عرض معلوماتك الشخصية
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
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
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

                    <MuiDivider sx={{ borderColor: 'var(--color-border-glass)', mb: 4 }} />

                    {/* Profile Information Display */}
                    <MuiGrid container spacing={3}>
                        {/* Name Field */}
                        <MuiGrid item xs={12} md={4}>
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

                        {/* Phone Field */}
                        <MuiGrid item xs={12} md={4}>
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

                        {/* Role Field */}
                        <MuiGrid item xs={12} md={4}>
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
                                            {user?.role === 'client' ? 'عميل' : user?.role}
                                        </MuiTypography>
                                    </MuiCardContent>
                                </MuiCard>
                            </MuiBox>
                        </MuiGrid>
                    </MuiGrid>
                </MuiBox>
            </MuiPaper>

        </MuiBox>
    )
}
