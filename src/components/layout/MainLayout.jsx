// src\components\layout\MainLayout.jsx
import { useState } from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import MuiBox from '@/components/ui/MuiBox'

const DRAWER_WIDTH = 280
const DRAWER_WIDTH_COLLAPSED = 80

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleCollapsedChange = (collapsed) => {
    setSidebarCollapsed(collapsed)
  }

  const sidebarWidth = sidebarCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onToggleSidebar={handleToggleSidebar}
        onCollapsedChange={handleCollapsedChange}
      />
      
      {/* Main Content */}
      <MuiBox
        component="main"
        className="flex-1 transition-all duration-300"
        sx={{
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          marginRight: {
            xs: 0,
            md: sidebarOpen ? `${sidebarWidth}px` : '0'
          }
        }}
      >
        <MuiBox
          className="min-h-screen"
          sx={{
            paddingTop: { xs: '80px', md: '88px' },
            padding: { 
              xs: '80px 8px 8px 8px', 
              sm: '88px 12px 12px 12px',
              md: '88px 20px 20px 20px',
              lg: '88px 40px 40px 40px'
            },
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}
        >
          <Outlet />
        </MuiBox>
      </MuiBox>
    </div>
  )
}