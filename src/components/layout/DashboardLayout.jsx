// src\components\layout\DashboardLayout.jsx
/**
 * Dashboard Layout
 * A modern and engaging layout for the dashboard inspired by AuthLayout
 */

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import MuiBox from '@/components/ui/MuiBox';
import Sidebar from './Sidebar';
import { useMediaQuery } from '@/hooks';

export default function DashboardLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const isMobile = useMediaQuery('(max-width: 767px)'); // Changed to match Tailwind's 'md' (768px)

    const DRAWER_WIDTH = isMobile ? 280 : (collapsed ? 80 : 280);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleCollapsedChange = (isCollapsed) => {
        setCollapsed(isCollapsed);
    };

    return (
        <MuiBox className="flex min-h-screen relative overflow-hidden" sx={{ backgroundColor: 'var(--layout-page-bg)' }}>
            <Sidebar
                open={mobileOpen}
                onClose={handleDrawerToggle}
                variant={isMobile ? 'temporary' : 'permanent'}
                drawerWidth={DRAWER_WIDTH}
                collapsed={collapsed}
                onCollapsedChange={handleCollapsedChange}
            />

            {/* Main Content */}
            <MuiBox
                component="main"
                className="flex-1 flex flex-col relative z-10 transition-all duration-300 ease-in-out"
                style={{
                    marginRight: isMobile ? 0 : DRAWER_WIDTH,
                    width: isMobile ? '100%' : `calc(100% - ${DRAWER_WIDTH}px)`,
                }}
            >
                {/* Page Content */}
                <MuiBox 
                    component="section"
                    sx={{ 
                        flex: 1, 
                        p: { xs: 2, md: 3, lg: 4 },
                        pt: { xs: 9, md: 10.5 },
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    <div className="p-0 min-h-full overflow-x-hidden">
                        <Outlet />
                    </div>
                </MuiBox>
            </MuiBox>

        </MuiBox>
    );
}
