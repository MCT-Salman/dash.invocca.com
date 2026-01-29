// src/components/common/ThemeToggle.jsx
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

    return (
        <MuiTooltip title={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'} arrow>
            <MuiIconButton
                onClick={toggleTheme}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                sx={{
                    color: 'var(--color-primary-500)',
                    border: '1px solid var(--color-border)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        backgroundColor: 'var(--color-surface-hover)',
                        borderColor: 'var(--color-primary-500)',
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
