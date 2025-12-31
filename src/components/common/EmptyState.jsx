import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'

export default function EmptyState({
    title = 'لا يوجد بيانات',
    description = 'لم يتم العثور على أي نتائج تتطابق مع بحثك.',
    icon: Icon,
    showPaper = true,
    action = null,
    sx = {}
}) {
    const content = (
        <MuiBox
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 6,
                textAlign: 'center',
                gap: 2,
                ...(!showPaper && sx)
            }}
        >
            {Icon && (
                <MuiBox
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(216, 185, 138, 0.05)',
                        color: 'var(--color-primary-400)',
                        mb: 2,
                        border: '1px solid var(--color-border-glass)'
                    }}
                >
                    <Icon size={40} />
                </MuiBox>
            )}
            <MuiTypography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
                {title}
            </MuiTypography>
            <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)', maxWidth: '400px' }}>
                {description}
            </MuiTypography>
            {action && (
                <MuiBox sx={{ mt: 2 }}>
                    {action}
                </MuiBox>
            )}
        </MuiBox>
    )

    if (showPaper) {
        return (
            <MuiPaper
                sx={{
                    background: 'rgba(26, 26, 26, 0.4)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    border: '1px solid var(--color-border-glass)',
                    ...sx
                }}
            >
                {content}
            </MuiPaper>
        )
    }

    return content
}
