// src\components\layout\Header.jsx
import { useState } from 'react'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiIconButton from '@mui/material/IconButton'
import MuiAvatar from '@mui/material/Avatar'
import MuiMenu from '@mui/material/Menu'
import MuiMenuItem from '@mui/material/MenuItem'
import { Menu, X, User, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks'
import { useTheme } from '@/contexts/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/config/constants'
import { ThemeToggle } from '@/components/common'

const Header = ({ onToggleSidebar, sidebarOpen = true, sidebarCollapsed = false }) => {
    const { user, logout } = useAuth()
    const { isDark } = useTheme()
    const navigate = useNavigate()
    const [menuAnchor, setMenuAnchor] = useState(null)

    const handleMenuOpen = (event) => {
        setMenuAnchor(event.currentTarget)
    }

    const handleMenuClose = () => {
        setMenuAnchor(null)
    }

    const handleLogout = () => {
        logout()
        handleMenuClose()
    }

    return (
        <MuiBox
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: {
                    xs: 0,
                    md: sidebarOpen ? (sidebarCollapsed ? '80px' : '240px') : 0
                },
                width: {
                    xs: '100%',
                    md: sidebarOpen ? (sidebarCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 240px)') : '100%'
                },
                marginLeft: {
                    xs: 0,
                    md: sidebarOpen ? (sidebarCollapsed ? '80px' : '240px') : 0
                },
                height: { xs: '64px', md: '72px' },
                zIndex: 1100,
                backgroundColor: isDark
                    ? 'color-mix(in srgb, var(--color-dark) 82%, var(--color-icon) 18%)'
                    : 'var(--color-gold)',
                borderBottom: '1px solid color-mix(in srgb, var(--color-border) 52%, transparent)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        >
            <MuiBox
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: { xs: 2, md: 3, lg: 4 },
                    height: '100%',
                }}
            >
                {/* Left Section */}
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                    {/* Mobile Menu Toggle */}
                    <MuiIconButton
                        onClick={onToggleSidebar}
                        sx={{
                            display: { md: 'none' },
                            color: isDark ? 'var(--color-gold)' : 'var(--color-dark)',
                            '& svg': {
                                color: 'currentColor !important',
                            },
                            '&:hover': {
                                backgroundColor: isDark 
                                    ? 'rgba(255, 253, 246, 0.2)'  // Using color-light-soft with opacity
                                    : 'rgba(26, 26, 26, 0.1)',   // Using color-dark with opacity
                                transform: 'scale(1.05)',
                                color: isDark ? 'var(--color-light-soft)' : 'var(--color-dark)',
                                '& svg': {
                                    color: 'currentColor !important',
                                }
                            }
                        }}
                    >
                        {sidebarOpen ? <Menu size={22} /> : <X size={22} />}
                    </MuiIconButton>

                    {/* User Menu - Profile */}
                    <MuiIconButton
                        onClick={handleMenuOpen}
                        sx={{
                            border: `2px solid ${isDark
                                ? 'color-mix(in srgb, var(--color-light) 35%, transparent)'
                                : 'color-mix(in srgb, var(--color-dark) 15%, transparent)'
                            }`,
                            p: 0.5,
                            backgroundColor: isDark
                                ? 'color-mix(in srgb, var(--color-icon) 28%, var(--color-dark) 72%)'
                                : 'color-mix(in srgb, var(--color-light) 86%, var(--color-icon) 14%)',
                            '&:hover': {
                                borderColor: isDark
                                    ? 'color-mix(in srgb, var(--color-light) 55%, transparent)'
                                    : 'color-mix(in srgb, var(--color-dark) 28%, transparent)',
                                backgroundColor: isDark
                                    ? 'color-mix(in srgb, var(--color-icon) 38%, var(--color-dark) 62%)'
                                    : 'color-mix(in srgb, var(--color-light) 78%, var(--color-icon) 22%)',
                            }
                        }}
                    >
                        <MuiAvatar
                            sx={{
                                width: 36,
                                height: 36,
                                backgroundColor: isDark
                                    ? 'color-mix(in srgb, var(--color-icon) 28%, var(--color-dark) 72%)'
                                    : 'color-mix(in srgb, var(--color-light) 86%, var(--color-icon) 14%)',
                                color: isDark ? 'var(--color-light)' : 'var(--color-dark)',
                                fontWeight: 'bold'
                            }}
                        >
                            {user?.name?.[0]?.toUpperCase() || <User size={18} />}
                        </MuiAvatar>
                    </MuiIconButton>

                    {/* Greeting/Title */}
                    <MuiBox sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <MuiTypography variant="subtitle1" sx={{ color: isDark ? 'var(--color-light)' : 'var(--color-dark)', fontWeight: 500 }}>
                            مرحباً <span style={{ color: isDark ? 'var(--color-light)' : 'var(--color-dark)', fontWeight: 700 }}>{user?.name?.split(' ')[0]}</span>
                        </MuiTypography>
                    </MuiBox>
                </MuiBox>

                {/* Right Section */}
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Theme Toggle */}
                    <ThemeToggle />
                </MuiBox>
            </MuiBox>

            {/* User Menu Dropdown */}
            <MuiMenu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        minWidth: 200,
                        backgroundColor: 'var(--color-paper)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '12px',
                        boxShadow: 'none',
                        color: 'var(--color-text-primary)',
                        '& .MuiMenuItem-root': {
                            color: 'var(--color-text-primary)',
                        }
                    }
                }}
            >
                <MuiBox sx={{ px: 2, py: 1.5, borderBottom: '1px solid var(--color-border)' }}>
                    <MuiTypography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--color-icon)' }}>
                        {user?.name || 'المستخدم'}
                    </MuiTypography>
                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                        {user?.email || user?.phone || ''}
                    </MuiTypography>
                </MuiBox>
                <MuiMenuItem
                    onClick={() => {
                        // Navigate to profile based on user role
                        const profilePath = user?.role === 'admin'
                            ? ROUTES.ADMIN.PROFILE
                            : user?.role === 'manager'
                                ? ROUTES.MANAGER.PROFILE
                                : user?.role === 'client'
                                    ? ROUTES.CLIENT.PROFILE
                                    : '/profile'
                        navigate(profilePath)
                        handleMenuClose()
                    }}
                    sx={{
                        py: 1.5,
                        '&:hover': {
                            backgroundColor: 'var(--color-surface-hover)'
                        }
                    }}
                >
                    <User size={18} style={{ marginLeft: 12 }} />
                    الملف الشخصي
                </MuiMenuItem>
                <MuiBox sx={{ borderTop: '1px solid var(--color-border-glass)', mt: 0.5 }}>
                    <MuiMenuItem
                        onClick={handleLogout}
                        sx={{
                            py: 1.5,
                            color: 'var(--color-error-500) !important',
                            '&:hover': {
                                backgroundColor: 'var(--color-surface-hover)'
                            }
                        }}
                    >
                        <LogOut size={18} style={{ marginLeft: 12 }} />
                        تسجيل الخروج
                    </MuiMenuItem>
                </MuiBox>
            </MuiMenu>
        </MuiBox>
    )
}

export default Header