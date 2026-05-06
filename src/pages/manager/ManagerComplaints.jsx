// src\pages\manager\ManagerComplaints.jsx
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'
import { MessageCircle } from 'lucide-react'
import { SEOHead } from '@/components/common'

export default function ManagerComplaints() {
    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
            <SEOHead title="الشكاوى | INVOCCA" />

            <MuiBox sx={{ mb: 4, textAlign: 'center' }}>
                <MuiTypography variant="h3" sx={{ 
                    fontWeight: 800, 
                    color: 'var(--color-icon)', 
                    mb: 1,
                    background: 'linear-gradient(135deg, var(--color-icon), var(--color-gold))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    الشكاوى
                </MuiTypography>
                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
                    إدارة شكاوى العملاء ومتابعة الحالات
                </MuiTypography>
            </MuiBox>

            <MuiPaper
                elevation={0}
                sx={{
                    p: 6,
                    background: 'var(--color-paper)',
                    border: '1px solid var(--color-border-glass)',
                    borderRadius: '24px',
                    textAlign: 'center'
                }}
            >
                <MuiBox>
                    <MessageCircle size={64} style={{ color: 'var(--color-text-disabled)', opacity: 0.5, margin: '0 auto 1.5rem' }} />
                    <MuiTypography variant="h6" sx={{ color: 'var(--color-text-secondary)', mb: 2, fontWeight: 700 }}>
                        لا توجد شكاوى حالياً
                    </MuiTypography>
                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-disabled)' }}>
                        سيتم عرض أي شكوى جديدة تصل من العملاء هنا.
                    </MuiTypography>
                </MuiBox>
            </MuiPaper>
        </MuiBox>
    )
}
