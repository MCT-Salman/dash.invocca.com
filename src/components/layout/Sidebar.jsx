// src\components\layout\Sidebar.jsx
import { useLocation, useNavigate } from 'react-router-dom'
import MuiDrawer from '@mui/material/Drawer'
import MuiBox from '@/components/ui/MuiBox'
import MuiList from '@mui/material/List'
import MuiListItem from '@mui/material/ListItem'
import MuiListItemButton from '@mui/material/ListItemButton'
import MuiListItemIcon from '@mui/material/ListItemIcon'
import MuiListItemText from '@mui/material/ListItemText'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiDivider from '@mui/material/Divider'
import MuiTooltip from '@mui/material/Tooltip'
import MuiDialog from '@/components/ui/MuiDialog'
import MuiDialogTitle from '@/components/ui/MuiDialogTitle'
import MuiDialogContent from '@/components/ui/MuiDialogContent'
import MuiDialogActions from '@/components/ui/MuiDialogActions'
import MuiButton from '@/components/ui/MuiButton'
import { useAuth, useMediaQuery } from '@/hooks'
import { useTheme } from '@/contexts/ThemeContext'
import { ROLE_MENUS } from './menuConfig'
import { LogOut } from 'lucide-react'
import { useState } from 'react'
import Header from './Header'

const DRAWER_WIDTH = 240
const DRAWER_WIDTH_COLLAPSED = 80

export default function Sidebar({ onClose, collapsed, onCollapsedChange }) {
  const { user, logout } = useAuth()
  const { isDark } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 900px)')
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true)
  }

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false)
    logout()
  }

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false)
  }

  // Handle roles as array - get the primary role for menu display
  const userRoles = Array.isArray(user?.role) ? user.role : [user?.role]
  
  // Map scanner role to employee menu and get primary role for menu
  const normalizedRoles = userRoles.map(role => 
    role === 'scanner' ? 'employee' : role
  )
  const primaryRole = normalizedRoles[0] // Use first role for menu display
  const menuItems = primaryRole ? (ROLE_MENUS[primaryRole] || []) : []
  const [mobileOpen, setMobileOpen] = useState(false)
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }
  const handleItemClick = (path) => {
    navigate(path)
    if (isMobile) onClose()
  }

  const sidebarBg = isDark ? 'color-mix(in srgb, var(--color-dark) 92%, var(--color-icon) 8%)' : 'var(--color-light)'
  const sidebarHeaderBg = 'var(--color-icon)'
  const sidebarHeaderHoverBg = isDark ? 'color-mix(in srgb, var(--color-dark) 78%, var(--color-icon) 22%)' : 'color-mix(in srgb, var(--color-light) 90%, var(--color-icon) 10%)'
  const activeItemBg = isDark ? 'color-mix(in srgb, var(--color-icon) 24%, var(--color-dark) 76%)' : 'var(--color-gold)'
  const itemHoverBg = isDark ? 'color-mix(in srgb, var(--color-icon) 16%, var(--color-dark) 84%)' : 'color-mix(in srgb, var(--color-icon) 24%, var(--color-paper) 76%)'
  const activeIconColor = isDark ? 'var(--color-light)' : 'var(--color-dark)'
  const inactiveIconColor = isDark
    ? 'color-mix(in srgb, var(--color-light) 78%, var(--color-icon) 22%)'
    : 'color-mix(in srgb, var(--color-dark) 68%, var(--color-gold) 32%)'
  const activeTextColor = isDark ? 'var(--color-light)' : 'var(--color-dark)'
  const inactiveTextColor = isDark
    ? 'color-mix(in srgb, var(--color-light) 88%, var(--color-icon) 12%)'
    : 'color-mix(in srgb, var(--color-text-secondary) 90%, var(--color-icon) 10%)'

  const drawerContent = (
    <MuiBox
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: sidebarBg,
        backgroundImage: 'none',
        borderLeft: '1px solid color-mix(in srgb, var(--color-border) 42%, transparent)',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 0
      }}
    >
      {/* Logo Area */}
      <MuiBox
        onClick={() => {
          if (!isMobile) {
            onCollapsedChange?.(!collapsed)
          }
        }}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: collapsed ? 0 : 2,
          justifyContent: 'center',
          borderBottom: '1px solid color-mix(in srgb, var(--color-border) 48%, transparent)',
          background: sidebarHeaderBg,
          position: 'relative',
          zIndex: 1,
          cursor: !isMobile ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
        }}
      >
        <MuiBox
          sx={{
            width: collapsed ? 40 : 'auto',
            height: 40,
            borderRadius: collapsed ? '12px' : '0',
            background: 'var(--color-icon)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'none',
            transition: 'all 0.3s ease',
            color: 'var(--color-text-on-primary)'
          }}
        >
          <img
            src={collapsed ? "/logo/logo-white.png" : "/logo/logo_with_text.png"}
            alt="INVOCCA"
            style={{ 
              width: collapsed ? 24 : 140, 
              height: collapsed ? 24 : 'auto', 
              objectFit: 'contain' 
            }}
          />
        </MuiBox>
        {/* {!collapsed && (
          <MuiBox sx={{ transition: 'opacity 0.3s ease', opacity: collapsed ? 0 : 1 }}>
            <MuiTypography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                fontSize: '1.25rem',
                letterSpacing: '0.05em',
                fontFamily: 'var(--font-family-base)'
              }}
            >
              INVOCsCA
            </MuiTypography>
          </MuiBox>
        )} */}
      </MuiBox>

      {/* Menu Items */}
      <MuiList
        sx={{
          flex: 1,
          px: 1.5,
          py: 2,
          overflowY: 'auto',
          position: 'relative',
          zIndex: 1,
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': { background: 'var(--color-border)', borderRadius: '2px' }
        }}
      >
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/admin/dashboard' &&
              item.path !== '/manager/dashboard' &&
              item.path !== '/client/dashboard' &&
              location.pathname.startsWith(item.path))
          const Icon = item.icon

          const listItemButton = (
            <MuiListItemButton
              onClick={() => handleItemClick(item.path)}
              sx={{
                py: 1.25,
                px: collapsed ? 1.5 : 2,
                minHeight: 48,
                borderRadius: 0.7,
                justifyContent: collapsed ? 'center' : 'flex-end',
                flexDirection: collapsed ? 'row' : 'row-reverse',
                mb: 0.5,
                border: '1px solid transparent',
                backgroundColor: isActive
                  ? activeItemBg
                  : 'transparent',
                borderColor: isActive ? 'color-mix(in srgb, var(--color-border) 46%, transparent)' : 'transparent',
                '&:hover': {
                  backgroundColor: itemHoverBg,
                  borderColor: isActive ? 'color-mix(in srgb, var(--color-border) 46%, transparent)' : 'transparent',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <MuiListItemIcon
                sx={{
                  minWidth: collapsed ? 0 : 40,
                  color: isActive
                    ? activeIconColor
                    : inactiveIconColor,
                  transition: 'all 0.2s ease',
                  justifyContent: collapsed ? 'center' : 'flex-end',
                  marginLeft: collapsed ? 0 : 1,
                  marginRight: collapsed ? 0 : 0,
                }}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2 : 1.5}
                  color={isActive ? activeIconColor : inactiveIconColor}
                />
              </MuiListItemIcon>
              {!collapsed && (
                <MuiListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive
                      ? activeTextColor
                      : inactiveTextColor,
                    fontFamily: 'var(--font-family-base)',
                  }}
                  sx={{
                    textAlign: 'right',
                    '& .MuiListItemText-primary': {
                      textAlign: 'right',
                      fontFamily: 'var(--font-family-base)',
                    }
                  }}
                />
              )}
            </MuiListItemButton>
          )

          return (
            <MuiListItem key={item.path} disablePadding>
              {collapsed ? (
                <MuiTooltip title={item.label} placement="left" arrow>
                  {listItemButton}
                </MuiTooltip>
              ) : (
                listItemButton
              )}
            </MuiListItem>
          )
        })}
      </MuiList>

      <MuiDivider sx={{ borderColor: 'color-mix(in srgb, var(--color-border) 42%, transparent)', mx: 2, opacity: 0.6 }} />

      {/* Logout Section */}
      <MuiBox
        sx={{
          p: 1.5,
          borderTop: '1px solid color-mix(in srgb, var(--color-border) 42%, transparent)',
          position: 'relative',
          zIndex: 1
        }}
      >
        {(() => {
          const logoutButton = (
            <MuiListItemButton
              onClick={handleLogoutClick}
              sx={{
                py: 1.25,
                px: collapsed ? 1.5 : 2,
                minHeight: 48,
                borderRadius: 0,
                justifyContent: collapsed ? 'center' : 'flex-end',
                flexDirection: collapsed ? 'row' : 'row-reverse',
                backgroundColor: 'transparent',
                color: inactiveTextColor,
                '&:hover': {
                  backgroundColor: itemHoverBg,
                  color: 'var(--color-error-500) !important',
                  '& *': {
                    color: 'var(--color-error-500) !important',
                  }
                }
              }}
            >
              <MuiListItemIcon
                sx={{
                  minWidth: collapsed ? 0 : 40,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  marginLeft: collapsed ? 0 : 1,
                }}
              >
                <LogOut size={20} strokeWidth={1.5} style={{ color: 'currentColor' }} />
              </MuiListItemIcon>
              {!collapsed && (
                <MuiListItemText
                  primary="تسجيل الخروج"
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    fontFamily: 'var(--font-family-base)',
                  }}
                  sx={{
                    textAlign: 'right',
                    '& .MuiListItemText-primary': {
                      fontFamily: 'var(--font-family-base)',
                    }
                  }}
                />
              )}
            </MuiListItemButton>
          )

          return collapsed ? (
            <MuiTooltip title="تسجيل الخروج" placement="left" arrow>
              {logoutButton}
            </MuiTooltip>
          ) : (
            logoutButton
          )
        })()}
      </MuiBox>
    </MuiBox>
  )

  return (
    <>
      <Header
        onToggleSidebar={handleDrawerToggle}
        sidebarOpen={!mobileOpen}
        sidebarCollapsed={collapsed}
      />
      <MuiBox component="nav">
        {/* Mobile Drawer */}
        <MuiDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          anchor="right"
          ModalProps={{ keepMounted: true }}
          className="block md:hidden"
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH,
              border: 'none',
              borderRadius: 0,
              background: 'transparent',
              boxShadow: 'none'
            },
          }}
        >
          {drawerContent}
        </MuiDrawer>

        {/* Desktop Drawer */}
        <MuiDrawer
          variant="permanent"
          anchor="right"
          className="hidden md:block"
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH,
              transition: 'width 0.3s ease',
              border: 'none',
              borderLeft: '1px solid color-mix(in srgb, var(--color-border) 50%, transparent)',
              borderRadius: 0,
              background: 'transparent',
              boxShadow: 'none'
            },
          }}
        >
          {drawerContent}
        </MuiDrawer>
      </MuiBox>

      {/* Logout Confirmation Dialog */}
      <MuiDialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        maxWidth="xs"
        fullWidth
      >
        <MuiDialogTitle sx={{ textAlign: 'center', fontFamily: 'var(--font-family-base)' }}>
          تأكيد تسجيل الخروج
        </MuiDialogTitle>
        <MuiDialogContent sx={{ textAlign: 'center' }}>
          <MuiTypography sx={{ fontFamily: 'var(--font-family-base)', color: 'var(--color-text-secondary)' }}>
            هل أنت متأكد أنك تريد تسجيل الخروج؟
          </MuiTypography>
        </MuiDialogContent>
        <MuiDialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
          <MuiButton onClick={handleLogoutCancel} variant="outlined">
            إلغاء
          </MuiButton>
          <MuiButton onClick={handleLogoutConfirm} variant="contained" color="error">
            تسجيل الخروج
          </MuiButton>
        </MuiDialogActions>
      </MuiDialog>
    </>
  )
}
