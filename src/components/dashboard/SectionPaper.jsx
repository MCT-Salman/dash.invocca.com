import MuiPaper from '@/components/ui/MuiPaper'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiDivider from '@/components/ui/MuiDivider'

export default function SectionPaper({
    title,
    icon: Icon,
    children,
    action,
    sx = {}
}) {
    return (
        <MuiPaper
            elevation={0}
            sx={{
                p: 0,
                height: '100%',
                background: 'var(--color-paper)',
                border: '1px solid var(--color-border)',
                borderRadius: '20px',
                overflow: 'hidden',
                ...sx
            }}
        >
            {/* Header */}
            {(title || Icon || action) && (
                <MuiBox
                    sx={{
                        p: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--color-surface)',
                        borderBottom: '1px solid var(--color-border)'
                    }}
                >
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {Icon && (
                            <MuiBox
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '10px',
                                    backgroundColor: 'var(--color-primary-500)',
                                    color: 'var(--color-text-on-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid var(--color-border)'
                                }}
                            >
                                <Icon size={20} />
                            </MuiBox>
                        )}
                        <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>
                            {title}
                        </MuiTypography>
                    </MuiBox>
                    {action && (
                        <MuiBox>
                            {action}
                        </MuiBox>
                    )}
                </MuiBox>
            )}

            {/* Content */}
            <MuiBox sx={{ p: 3 }}>
                {children}
            </MuiBox>
        </MuiPaper>
    )
}
