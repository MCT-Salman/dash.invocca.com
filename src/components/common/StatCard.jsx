import React from 'react'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'

export default function StatCard({
    title,
    value,
    icon,
    highlighted = false,
    sx = {}
}) {
    // Check if icon is already a JSX element or a component
    const isJsxElement = icon && typeof icon === 'object' && icon.$$typeof === Symbol.for('react.element');
    
    return (
        <MuiPaper
            elevation={0}
            sx={{
                p: 2,
                height: '100%',
                background: highlighted ? 'var(--color-icon)' : 'var(--color-paper)',
                border: '1px solid var(--color-border)',
                borderRight: '4px solid var(--color-icon)',
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '4px',
                    background: 'var(--color-icon)',
                    transition: 'width 0.5s ease-out',
                    zIndex: 0,
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '0%',
                    background: 'var(--color-icon)',
                    transition: 'width 0.5s ease-out',
                    zIndex: 0,
                },
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    '&::after': {
                        width: '100%',
                    },
                    '& .statcard-icon-box': {
                        background: 'rgba(255,255,255,0.2)',
                        borderColor: 'rgba(255,255,255,0.3)',
                        color: 'var(--color-dark)',
                        '& svg': {
                            color: 'currentColor !important',
                        },
                    },
                    '& .statcard-value': {
                        color: 'var(--color-dark)',
                    },
                    '& .statcard-title': {
                        color: 'var(--color-dark)',
                    },
                },
                ...sx
            }}
        >
            <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                {/* Value - Left Side */}
                <MuiTypography
                    className="statcard-value"
                    variant="h4"
                    sx={{
                        fontWeight: 600,
                        fontSize: '2rem',
                        color: highlighted ? '#fff' : 'var(--color-text-primary)',
                        lineHeight: 1,
                        transition: 'color 0.3s ease',
                    }}
                >
                    {value}
                </MuiTypography>

                {/* Icon Box - Right Side */}
                <MuiBox
                    className="statcard-icon-box"
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '10px',
                        background: highlighted ? 'rgba(255,255,255,0.2)' : 'rgba(216, 185, 138, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid ${highlighted ? 'rgba(255,255,255,0.3)' : 'var(--color-icon)'}`,
                        color: highlighted ? '#fff' : 'var(--color-icon)',
                        transition: 'all 0.3s ease',
                    }}
                >
                    {icon}
                </MuiBox>
            </MuiBox>

            {/* Title - Below */}
            <MuiTypography
                className="statcard-title"
                variant="body2"
                sx={{
                    color: highlighted ? 'rgba(255,255,255,0.9)' : 'var(--color-text-secondary)',
                    fontWeight: 500,
                    fontSize: '0.85rem',
                    mt: 1.5,
                    transition: 'color 0.3s ease',
                    textAlign: 'right',
                    position: 'relative',
                    zIndex: 1
                }}
            >
                {title}
            </MuiTypography>
        </MuiPaper>
    )
}
