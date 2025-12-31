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
            case 'success': return '#16a34a';
            case 'error': return '#dc2626';
            case 'warning': return '#f59e0b';
            case 'info': return '#0284c7';
            default: return 'var(--color-primary-500)';
        }
    }

    const brandColor = getColor()

    return (
        <MuiPaper
            sx={{
                p: 3,
                height: '100%',
                background: 'rgba(26, 26, 26, 0.4)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                border: '1px solid var(--color-border-glass)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    borderColor: 'rgba(216, 185, 138, 0.3)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.3)'
                },
                ...sx
            }}
        >
            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <MuiBox
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `${brandColor}15`,
                        color: brandColor,
                        border: `1px solid ${brandColor}33`
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
                            color: trend.isPositive ? '#16a34a' : '#dc2626',
                            background: trend.isPositive ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                            px: 1,
                            py: 0.5,
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 700
                        }}
                    >
                        {trend.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {trend.value}%
                    </MuiBox>
                )}
            </MuiBox>

            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontWeight: 500, mb: 1 }}>
                {title}
            </MuiTypography>
            <MuiTypography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>
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
                    background: `radial-gradient(circle, ${brandColor}08 0%, transparent 70%)`,
                    zIndex: 0
                }}
            />
        </MuiPaper>
    )
}
