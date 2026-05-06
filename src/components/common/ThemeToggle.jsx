// src\components\common\ThemeToggle.jsx
import { Sun, Moon } from 'lucide-react'
import MuiIconButton from '@mui/material/IconButton'
import MuiTooltip from '@mui/material/Tooltip'
import { useTheme } from '@/contexts/ThemeContext'

/**
 * Theme Toggle Button Component
 * Switches between Light and Dark themes with smooth icon transitions
 */
const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme()
    const isDark = theme === 'dark'
    const iconColor = isDark ? 'var(--color-light)' : 'var(--color-dark)'
    const borderColor = isDark
        ? 'color-mix(in srgb, var(--color-light) 38%, transparent)'
        : 'color-mix(in srgb, var(--color-dark) 26%, transparent)'
    const bgColor = isDark
        ? 'color-mix(in srgb, var(--color-icon) 24%, var(--color-dark) 76%)'
        : 'color-mix(in srgb, var(--color-light) 88%, var(--color-gold) 12%)'
    const hoverBgColor = isDark
        ? 'color-mix(in srgb, var(--color-icon) 32%, var(--color-dark) 68%)'
        : 'color-mix(in srgb, var(--color-light) 80%, var(--color-gold) 20%)'

    return (
        <MuiTooltip title={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'} arrow>
            <MuiIconButton
                onClick={toggleTheme}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                sx={{
                    color: iconColor,
                    backgroundColor: bgColor,
                    border: `1px solid ${borderColor}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        backgroundColor: hoverBgColor,
                        borderColor: iconColor,
                        transform: 'scale(1.05) rotate(15deg)',
                    },
                    '& svg': {
                        transition: 'transform 0.3s ease',
                    },
                }}
            >
                {isDark ? (
                    <Sun size={20} strokeWidth={2} />
                ) : (
                    <Moon size={20} strokeWidth={2} />
                )}
            </MuiIconButton>
        </MuiTooltip>
    )
}

export default ThemeToggle
