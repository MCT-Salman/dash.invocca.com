import MuiPaper from '@/components/ui/MuiPaper'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({
    title,
    value,
    icon,
    trend,
    color = 'primary',
    sx = {}
}) {
    const getColor = () => {
        switch (color) {
            case 'primary': return 'var(--color-primary-500)';
            case 'secondary': return 'var(--color-secondary-500)';
            case 'success': return 'var(--color-success-500)';
            case 'error': return 'var(--color-error-500)';
            case 'warning': return 'var(--color-warning-500)';
            case 'info': return 'var(--color-info-500)';
            default: return 'var(--color-primary-500)';
        }
    }

    const brandColor = getColor()

    return (
        <MuiPaper
            sx={{
                p: 3,
                height: '100%',
                background: 'var(--color-paper)',
                boxShadow: 'var(--shadow-sm)',
                borderRadius: '20px',
                border: '1px solid var(--color-border)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    borderColor: 'var(--color-primary-500)',
                    boxShadow: 'var(--shadow-lg)'
                },
                ...sx
            }}
        >
            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, position: 'relative', zIndex: 1 }}>
                <MuiBox
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'var(--color-surface)',
                        color: brandColor,
                        border: '1px solid var(--color-border)'
                    }}
                >
                    {icon}
                </MuiBox>
                {trend && (
                    <MuiBox
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            color: trend.isPositive ? 'var(--color-success-500)' : 'var(--color-error-500)',
                            backgroundColor: 'var(--color-surface)',
                            px: 1,
                            py: 0.5,
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            border: '1px solid var(--color-border)'
                        }}
                    >
                        {trend.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {trend.value}%
                    </MuiBox>
                )}
            </MuiBox>

            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontWeight: 500, mb: 1, position: 'relative', zIndex: 1 }}>
                {title}
            </MuiTypography>
            <MuiTypography variant="h4" sx={{ fontWeight: 800, color: 'var(--color-text-primary)', position: 'relative', zIndex: 1 }}>
                {value}
            </MuiTypography>

            {/* Subtle background decoration */}
            <MuiBox
                sx={{
                    position: 'absolute',
                    bottom: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${brandColor} 0%, transparent 70%)`,
                    opacity: 0.05,
                    zIndex: 0
                }}
            />
        </MuiPaper>
    )
}
