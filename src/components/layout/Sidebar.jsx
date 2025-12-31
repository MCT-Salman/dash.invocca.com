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
import { useAuth, useMediaQuery } from '@/hooks'
import { ROLE_MENUS } from './menuConfig'
import { LogOut } from 'lucide-react'
import { useState } from 'react'
import Header from './Header'

const DRAWER_WIDTH = 280
const DRAWER_WIDTH_COLLAPSED = 80

export default function Sidebar({ open, onClose, variant = 'permanent', onCollapsedChange }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 900px)')

  // Map scanner role to employee menu
  const role = user?.role === 'scanner' ? 'employee' : user?.role
  const menuItems = role ? (ROLE_MENUS[role] || []) : []
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }
  const handleItemClick = (path) => {
    navigate(path)
    if (isMobile) onClose()
  }

  const handleLogout = () => {
    logout()
  }

  const drawerContent = (
    <MuiBox
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--color-surface-dark)', // Base dark color
        backgroundImage: 'linear-gradient(180deg, rgba(20, 20, 20, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        borderLeft: '1px solid var(--color-border-glass)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Golden Glow */}
      <MuiBox
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(216, 185, 138, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Logo Area */}
      <MuiBox
        onClick={() => {
          if (!isMobile) {
            const newCollapsed = !collapsed
            setCollapsed(newCollapsed)
            onCollapsedChange?.(newCollapsed)
          }
        }}
        sx={{
          p: collapsed ? 2 : 3,
          display: 'flex',
          alignItems: 'center',
          gap: collapsed ? 0 : 2,
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderBottom: '1px solid var(--color-border-glass)',
          background: 'rgba(255, 255, 255, 0.02)',
          position: 'relative',
          zIndex: 1,
          cursor: !isMobile ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: !isMobile ? 'rgba(255, 255, 255, 0.04)' : undefined,
          }
        }}
      >
        <MuiBox
          sx={{
            width: collapsed ? 40 : 48,
            height: collapsed ? 40 : 48,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-700) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(216, 185, 138, 0.3)',
            transition: 'all 0.3s ease',
            color: '#000'
          }}
        >
          <img
            src="/logo/logo-white.png"
            alt="INVOCCA"
            style={{ width: collapsed ? 24 : 28, height: collapsed ? 24 : 28, objectFit: 'contain', filter: 'brightness(0) saturate(100%)' }}
          />
        </MuiBox>
        {!collapsed && (
          <MuiBox sx={{ transition: 'opacity 0.3s ease', opacity: collapsed ? 0 : 1 }}>
            <MuiTypography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                fontSize: '1.25rem',
                letterSpacing: '0.05em'
              }}
            >
              INVOCCA
            </MuiTypography>
          </MuiBox>
        )}
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
          '&::-webkit-scrollbar-thumb': { background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px' }
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
                borderRadius: '8px',
                justifyContent: collapsed ? 'center' : 'flex-end',
                flexDirection: collapsed ? 'row' : 'row-reverse',
                mb: 0.5,
                border: '1px solid transparent',
                backgroundColor: isActive
                  ? 'rgba(216, 185, 138, 0.1)'
                  : 'transparent',
                borderColor: isActive
                  ? 'rgba(216, 185, 138, 0.2)'
                  : 'transparent',
                '&:hover': {
                  backgroundColor: isActive
                    ? 'rgba(216, 185, 138, 0.15)'
                    : 'rgba(255, 255, 255, 0.03)',
                  borderColor: isActive
                    ? 'rgba(216, 185, 138, 0.3)'
                    : 'rgba(255, 255, 255, 0.05)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <MuiListItemIcon
                sx={{
                  minWidth: collapsed ? 0 : 40,
                  color: isActive
                    ? 'var(--color-primary-500)'
                    : 'var(--color-text-secondary)',
                  transition: 'all 0.2s ease',
                  justifyContent: collapsed ? 'center' : 'flex-end',
                  marginLeft: collapsed ? 0 : 1,
                  marginRight: collapsed ? 0 : 0,
                }}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2 : 1.5}
                />
              </MuiListItemIcon>
              {!collapsed && (
                <MuiListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive
                      ? 'var(--color-primary-100)'
                      : 'var(--color-text-secondary)',
                  }}
                  sx={{
                    textAlign: 'right',
                    '& .MuiListItemText-primary': {
                      textAlign: 'right',
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

      <MuiDivider sx={{ borderColor: 'rgba(255,255,255,0.05)', mx: 2 }} />

      {/* Logout Section */}
      <MuiBox
        sx={{
          p: 1.5,
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'relative',
          zIndex: 1
        }}
      >
        {(() => {
          const logoutButton = (
            <MuiListItemButton
              onClick={handleLogout}
              sx={{
                py: 1.25,
                px: collapsed ? 1.5 : 2,
                minHeight: 48,
                borderRadius: '8px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                backgroundColor: 'transparent',
                color: 'var(--color-text-secondary)',
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: 'var(--color-error-500)',
                }
              }}
            >
              <MuiListItemIcon
                sx={{
                  minWidth: collapsed ? 0 : 40,
                  color: 'inherit',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}
              >
                <LogOut size={20} strokeWidth={1.5} />
              </MuiListItemIcon>
              {!collapsed && (
                <MuiListItemText
                  primary="تسجيل الخروج"
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
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
              background: 'transparent',
              boxShadow: 'none'
            },
          }}
        >
          {drawerContent}
        </MuiDrawer>
      </MuiBox>
    </>
  )
}
