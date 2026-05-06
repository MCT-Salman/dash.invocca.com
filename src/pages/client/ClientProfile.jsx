// src/pages/client/ClientProfile.jsx
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiDivider from '@/components/ui/MuiDivider'
import MuiAvatar from '@/components/ui/MuiAvatar'
import MuiGrid from '@/components/ui/MuiGrid'
import { SEOHead } from '@/components/common'
import { useAuth } from '@/hooks'
import { User, Phone, Shield, Star } from 'lucide-react'

export default function ClientProfile() {
    const { user } = useAuth()

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
            <SEOHead title="الملف الشخصي | INVOCCA" />

            <MuiBox sx={{ mb: 4, textAlign: 'center' }}>
                <MuiTypography variant="h3" sx={{ fontWeight: 800, color: 'var(--color-icon)', mb: 1 }}>الملف الشخصي</MuiTypography>
                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>إدارة معلوماتك الشخصية وإعدادات الحساب</MuiTypography>
            </MuiBox>

            <MuiPaper sx={{ p: 4, borderRadius: '24px', background: 'var(--color-paper)', border: '1px solid var(--color-border)' }}>
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                    <MuiAvatar sx={{ width: 80, height: 80, border: '3px solid var(--color-icon)', bgcolor: 'transparent' }}>
                        <User size={40} style={{ color: 'var(--color-icon)' }} />
                    </MuiAvatar>
                    <MuiBox>
                        <MuiTypography variant="h5" sx={{ fontWeight: 700 }}>{user?.name}</MuiTypography>
                        <MuiTypography variant="body2" sx={{ color: 'var(--color-icon)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Star size={16} /> عميل مميز
                        </MuiTypography>
                    </MuiBox>
                </MuiBox>

                <MuiDivider sx={{ mb: 4 }} />

                <MuiGrid container spacing={4}>
                    <MuiGrid item xs={12} md={4}>
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 1 }}>الاسم الكامل</MuiTypography>
                        <MuiTypography variant="body1" sx={{ fontWeight: 600 }}>{user?.name}</MuiTypography>
                    </MuiGrid>
                    <MuiGrid item xs={12} md={4}>
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 1 }}>رقم الهاتف</MuiTypography>
                        <MuiTypography variant="body1" sx={{ fontWeight: 600 }}>{user?.phone}</MuiTypography>
                    </MuiGrid>
                    <MuiGrid item xs={12} md={4}>
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 1 }}>الدور</MuiTypography>
                        <MuiTypography variant="body1" sx={{ fontWeight: 600 }}>{user?.role === 'client' ? 'عميل' : user?.role}</MuiTypography>
                    </MuiGrid>
                </MuiGrid>
            </MuiPaper>
        </MuiBox>
    )
}
