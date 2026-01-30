// src/pages/manager/ManagerComplaints.jsx
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'
import { MessageCircle } from 'lucide-react'
import { EmptyState, SEOHead } from '@/components/common'

export default function ManagerComplaints() {
    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh' }}>
            <SEOHead title="الشكاوى - INVOCCA" />

            {/* Header */}
            <MuiBox sx={{ mb: 4, textAlign: 'center' }}>
                <MuiTypography variant="h3" sx={{ 
                    fontWeight: 800, 
                    color: 'var(--color-text-primary)', 
                    mb: 1,
                    background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
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

            {/* Empty State */}
            <MuiPaper
                elevation={0}
                sx={{
                    p: 6,
                    background: 'var(--color-paper)',
                    border: '1px solid var(--color-border-glass)',
                    borderRadius: '24px',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '200px',
                        height: '200px',
                        background: 'radial-gradient(circle, rgba(216, 185, 138, 0.08) 0%, transparent 70%)',
                        borderRadius: '50%',
                    }
                }}
            >
                <MuiBox sx={{ position: 'relative', zIndex: 1 }}>
                    <MessageCircle size={64} style={{ 
                        color: 'var(--color-text-disabled)', 
                        opacity: 0.5,
                        margin: '0 auto 1.5rem'
                    }} />
                    <MuiTypography variant="h6" sx={{ 
                        color: 'var(--color-text-secondary)', 
                        mb: 2, 
                        fontWeight: 700 
                    }}>
                        لا توجد شكاوى
                    </MuiTypography>
                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-disabled)' }}>
                        لم يتم تسجيل أي شكاوى لقاعة/صالة هذه بعد.
                    </MuiTypography>
                </MuiBox>
            </MuiPaper>
        </MuiBox>
    )
}
