// src\components\layout\Header.jsx
import { useState, useEffect } from 'react'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiIconButton from '@mui/material/IconButton'
import MuiAvatar from '@mui/material/Avatar'
import MuiBadge from '@mui/material/Badge'
import MuiMenu from '@mui/material/Menu'
import MuiMenuItem from '@mui/material/MenuItem'
import { Menu, X, Bell, User, Sparkles, LogOut, Settings, Search } from 'lucide-react'
import { useAuth } from '@/hooks'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/config/constants'
import { ThemeToggle } from '@/components/common'

const Header = ({ onToggleSidebar, sidebarOpen = true, sidebarCollapsed = false }) => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [scrolled, setScrolled] = useState(false)
    const [menuAnchor, setMenuAnchor] = useState(null)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

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
                    md: sidebarOpen ? (sidebarCollapsed ? '80px' : '280px') : 0
                },
                width: {
                    xs: '100%',
                    md: sidebarOpen ? (sidebarCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 280px)') : '100%'
                },
                marginLeft: {
                    xs: 0,
                    md: sidebarOpen ? (sidebarCollapsed ? '80px' : '280px') : 0
                },
                height: { xs: '64px', md: '72px' },
                zIndex: 1100,
                backdropFilter: 'blur(12px)',
                backgroundColor: scrolled
                    ? 'var(--color-surface-glass)'
                    : 'transparent',
                borderBottom: scrolled
                    ? '1px solid var(--color-border)'
                    : '1px solid transparent',
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
                            color: 'var(--color-primary-500)',
                            '&:hover': {
                                backgroundColor: 'var(--color-surface-hover)',
                                transform: 'scale(1.05)'
                            }
                        }}
                    >
                        {sidebarOpen ? <Menu size={22} /> : <X size={22} />}
                    </MuiIconButton>

                    {/* Greeting/Title */}
                    <MuiBox sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <MuiTypography variant="subtitle1" sx={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                            مرحباً، <span style={{ color: 'var(--color-primary-500)', fontWeight: 700 }}>{user?.name?.split(' ')[0]}</span>
                        </MuiTypography>
                    </MuiBox>
                </MuiBox>

                {/* Right Section */}
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* User Menu */}
                    <MuiIconButton
                        onClick={handleMenuOpen}
                        sx={{
                            border: '1px solid var(--color-border)',
                            p: 0.5,
                            '&:hover': {
                                transform: 'scale(1.05)',
                                borderColor: 'var(--color-primary-500)'
                            }
                        }}
                    >
                        <MuiAvatar
                            sx={{
                                width: 36,
                                height: 36,
                                backgroundColor: 'var(--color-primary-700)',
                                color: 'var(--color-primary-100)',
                                fontWeight: 'bold'
                            }}
                        >
                            {user?.name?.[0]?.toUpperCase() || <User size={18} />}
                        </MuiAvatar>
                    </MuiIconButton>
                </MuiBox>
            </MuiBox>

            {/* User Menu Dropdown */}
            <MuiMenu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        minWidth: 200,
                        backgroundColor: 'var(--color-paper)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                        color: 'var(--color-text-primary)',
                        '& .MuiMenuItem-root': {
                            color: 'var(--color-text-primary)',
                        }
                    }
                }}
            >
                <MuiBox sx={{ px: 2, py: 1.5, borderBottom: '1px solid var(--color-border)' }}>
                    <MuiTypography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--color-primary-500)' }}>
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