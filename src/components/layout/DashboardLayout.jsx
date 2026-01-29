/**
 * Dashboard Layout
 * A modern and engaging layout for the dashboard inspired by AuthLayout
 */

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import MuiBox from '@/components/ui/MuiBox';
import MuiAppBar from '@mui/material/AppBar';
import MuiToolbar from '@mui/material/Toolbar';
import MuiTypography from '@/components/ui/MuiTypography';
import MuiIconButton from '@/components/ui/MuiIconButton';
import Sidebar from './Sidebar';
import { Menu, Bell, User } from 'lucide-react';
import { useMediaQuery } from '@/hooks';

const DRAWER_WIDTH = 280;

export default function DashboardLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width: 900px)');

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <MuiBox className="flex min-h-screen bg-gradient-to-br from-yellow-pale via-white to-beige-light/30 relative overflow-hidden">
            {/* Animated background effects */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-br from-secondary/5 to-beige-dark/5 animate-float"
                        style={{
                            width: `${150 + i * 100}px`,
                            height: `${150 + i * 100}px`,
                            top: `${20 + i * 20}%`,
                            left: `${15 + i * 15}%`,
                            animationDelay: `${i * 0.7}s`,
                            animationDuration: `${10 + i * 2}s`,
                        }}
                    />
                ))}
            </div>

            {/* Sidebar */}
            <Sidebar
                open={mobileOpen}
                onClose={handleDrawerToggle}
                variant="permanent"
                drawerWidth={DRAWER_WIDTH}
            />

            {/* Main Content */}
            <MuiBox
                component="main"
                className="flex-1 flex flex-col relative z-10"
                style={{
                    marginRight: isMobile ? 0 : DRAWER_WIDTH,
                }}
            >
                {/* AppBar */}
                <MuiAppBar
                    position="sticky"
                    className="!bg-white/80 !backdrop-blur-sm !shadow-lg !border-b !border-white/30"
                    elevation={0}
                    sx={{
                        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    }}
                >
                    <MuiToolbar className="px-4 md:px-6 min-h-[72px]">
                        {/* Mobile Menu Toggle */}
                        <MuiIconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            className="md:hidden ml-2 text-primary-700"
                        >
                            <Menu size={28} />
                        </MuiIconButton>

                        {/* Title */}
                        <MuiTypography
                            variant="h5"
                            className="flex-1 font-black text-primary-700 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent"
                        >
                            INVOCCA
                        </MuiTypography>

                        {/* Action Icons */}
                        <MuiBox>
                            <MuiIconButton className="text-primary-700 hover:bg-primary/10">
                                <Bell size={22} />
                            </MuiIconButton>
                            <MuiIconButton className="text-primary-700 hover:bg-primary/10">
                                <User size={22} />
                            </MuiIconButton>
                        </MuiBox>
                    </MuiToolbar>
                </MuiAppBar>

                {/* Page Content */}
                <MuiBox className="flex-1 p-4 md:p-6 lg:p-8">
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/40 min-h-full">
                        <Outlet />
                    </div>
                </MuiBox>
            </MuiBox>

        </MuiBox>
    );
}
