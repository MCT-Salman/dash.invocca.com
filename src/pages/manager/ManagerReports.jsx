// src\pages\manager\ManagerReports.jsx
/**
 * Manager Reports Page
 * تقارير المدير
 */

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiButton from '@/components/ui/MuiButton'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiFormControl from '@/components/ui/MuiFormControl'
import {
    LoadingScreen,
    SEOHead,
} from '@/components/common'
import { QUERY_KEYS } from '@/config/constants'
import { getManagerReports } from '@/api/manager'
import {
    BarChart3,
    Calendar,
    Users,
    TrendingUp,
    Download,
    DollarSign,
} from 'lucide-react'

// Stat Card Component
const StatCard = ({ title, value, subtitle, icon: Icon, color = 'primary' }) => {
    const colors = {
        primary: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
        secondary: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
        success: 'linear-gradient(135deg, #22c55e, #16a34a)',
        warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
        info: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    }

    return (
        <MuiPaper 
            elevation={0}
            sx={{
                p: 3.5,
                background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(216, 185, 138, 0.15)',
                borderRadius: '20px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                '&:hover': {
                    transform: 'translateY(-6px) scale(1.02)',
                    boxShadow: '0 16px 32px rgba(0, 0, 0, 0.4), 0 0 30px rgba(216, 185, 138, 0.2)',
                    borderColor: 'rgba(216, 185, 138, 0.4)',
                    '&::before': {
                        opacity: 1
                    }
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: colors[color],
                    opacity: 0.6,
                    transition: 'opacity 0.4s ease'
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    right: '-20%',
                    width: '200px',
                    height: '200px',
                    background: `radial-gradient(circle, ${colors[color]}08 0%, transparent 70%)`,
                    borderRadius: '50%',
                    opacity: 0,
                    transition: 'opacity 0.4s ease'
                },
                '&:hover::after': {
                    opacity: 1
                }
            }}
        >
            <MuiBox sx={{ position: 'relative', zIndex: 1 }}>
                <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <MuiBox
                        sx={{
                            p: 3,
                            borderRadius: '16px',
                            background: colors[color],
                            color: '#fff',
                            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'rotate(6deg) scale(1.1)'
                            }
                        }}
                    >
                        <Icon size={24} />
                    </MuiBox>
                    {subtitle && (
                        <MuiTypography variant="caption" sx={{ 
                            background: 'rgba(34, 197, 94, 0.1)', 
                            color: '#22c55e', 
                            px: 2, 
                            py: 1, 
                            borderRadius: '20px', 
                            fontWeight: 600 
                        }}>
                            {subtitle}
                        </MuiTypography>
                    )}
                </MuiBox>

                <MuiTypography variant="h4" sx={{ 
                    fontWeight: 700, 
                    color: 'var(--color-text-primary-dark)', 
                    mb: 1 
                }}>
                    {value}
                </MuiTypography>
                <MuiTypography variant="body2" sx={{ 
                    color: 'var(--color-text-secondary)', 
                    fontWeight: 500 
                }}>
                    {title}
                </MuiTypography>
            </MuiBox>
        </MuiPaper>
    )
}

export default function ManagerReports() {
    const [period, setPeriod] = useState('month')

    // Fetch reports
    const { data: reports, isLoading } = useQuery({
        queryKey: [QUERY_KEYS.MANAGER_REPORTS, period],
        queryFn: () => getManagerReports(period),
    })

    if (isLoading) {
        return <LoadingScreen message="جاري تحميل التقارير..." fullScreen={false} />
    }

    const stats = reports?.stats || {
        totalEvents: 0,
        totalRevenue: 0,
        totalGuests: 0,
        occupancyRate: 0,
    }

    return (
        <MuiBox sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
            <SEOHead pageKey="managerReports" title="التقارير والإحصائيات | INVOCCA" />

            {/* Header Section - Premium Welcome Card */}
            <MuiBox
                sx={{
                    mb: 5,
                    p: { xs: 3, sm: 4.5, md: 5 },
                    borderRadius: '24px',
                    background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid rgba(216, 185, 138, 0.2)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(216, 185, 138, 0.1)',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '-50%',
                        right: '-20%',
                        width: '500px',
                        height: '500px',
                        background: 'radial-gradient(circle, rgba(216, 185, 138, 0.12) 0%, transparent 70%)',
                        borderRadius: '50%',
                        animation: 'pulse 4s ease-in-out infinite',
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '-30%',
                        left: '-10%',
                        width: '400px',
                        height: '400px',
                        background: 'radial-gradient(circle, rgba(216, 185, 138, 0.08) 0%, transparent 70%)',
                        borderRadius: '50%',
                        animation: 'pulse 5s ease-in-out infinite',
                    }
                }}
            >
                <MuiBox sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: { xs: 'wrap', sm: 'nowrap' }, gap: 3 }}>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
                        <MuiBox
                            sx={{
                                width: { xs: 64, sm: 72 },
                                height: { xs: 64, sm: 72 },
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid var(--color-primary-400)',
                                boxShadow: '0 10px 30px rgba(216, 185, 138, 0.3), 0 0 20px rgba(216, 185, 138, 0.2)',
                            }}
                        >
                            <BarChart3 size={36} style={{ color: '#fff', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }} />
                        </MuiBox>
                        <MuiBox sx={{ flex: 1 }}>
                            <MuiTypography 
                                variant="h4" 
                                sx={{ 
                                    color: 'var(--color-text-primary-dark)', 
                                    fontWeight: 800, 
                                    mb: 1,
                                    fontSize: { xs: '1.5rem', sm: '2rem' },
                                    background: 'linear-gradient(135deg, var(--color-text-primary-dark), var(--color-primary-500))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                التقارير والإحصائيات
                            </MuiTypography>
                            <MuiTypography 
                                variant="body1" 
                                sx={{ 
                                    color: 'var(--color-primary-400)',
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                    fontWeight: 500,
                                    letterSpacing: '0.3px'
                                }}
                            >
                                نظرة عامة على أداء قاعة/صالة والحجوزات
                            </MuiTypography>
                        </MuiBox>
                    </MuiBox>
                </MuiBox>
            </MuiBox>

            {/* Controls */}
            <MuiPaper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4.5,
                    background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(216, 185, 138, 0.15)',
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}
            >
                <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    <MuiFormControl size="small" sx={{ minWidth: 150 }}>
                        <MuiSelect
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            sx={{
                                borderRadius: '14px',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(216, 185, 138, 0.15)',
                                color: 'var(--color-text-primary-dark)',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '14px',
                                    '&:hover': {
                                        borderColor: 'rgba(216, 185, 138, 0.3)',
                                    },
                                    '&.Mui-focused': {
                                        borderColor: 'var(--color-primary-500)',
                                    }
                                },
                                '& .MuiSelect-icon': {
                                    color: 'var(--color-text-secondary)',
                                }
                            }}
                        >
                            <MuiMenuItem value="day">اليوم</MuiMenuItem>
                            <MuiMenuItem value="week">هذا الأسبوع</MuiMenuItem>
                            <MuiMenuItem value="month">هذا الشهر</MuiMenuItem>
                            <MuiMenuItem value="year">هذا العام</MuiMenuItem>
                        </MuiSelect>
                    </MuiFormControl>

                    <MuiButton
                        variant="outlined"
                        startIcon={<Download size={18} />}
                        sx={{
                            borderColor: 'rgba(216, 185, 138, 0.3)',
                            color: 'var(--color-primary-500)',
                            fontWeight: 600,
                            borderRadius: '14px',
                            px: 3,
                            py: 1.5,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                borderColor: 'var(--color-primary-500)',
                                backgroundColor: 'rgba(216, 185, 138, 0.1)',
                                transform: 'translateY(-2px)',
                            }
                        }}
                    >
                        تصدير
                    </MuiButton>
                </MuiBox>
            </MuiPaper>

            {/* Stats Grid */}
            <MuiGrid container spacing={3} sx={{ mb: 6 }}>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="إجمالي الحجوزات"
                        value={stats.totalEvents}
                        icon={Calendar}
                        color="primary"
                        subtitle="+12% مقارنة بالسابق"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="الإيرادات"
                        value={`${(stats.totalRevenue || 0).toLocaleString()} ل.س`}
                        icon={DollarSign}
                        color="success"
                        subtitle="+8% مقارنة بالسابق"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="إجمالي الضيوف"
                        value={(stats.totalGuests || 0).toLocaleString()}
                        icon={Users}
                        color="info"
                        subtitle="+5% مقارنة بالسابق"
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="نسبة الإشغال"
                        value={`${stats.occupancyRate || 0}%`}
                        icon={TrendingUp}
                        color="warning"
                        subtitle="+2% مقارنة بالسابق"
                    />
                </MuiGrid>
            </MuiGrid>

            {/* Charts Section (Placeholder for now) */}
            <MuiGrid container spacing={3}>
                <MuiGrid item xs={12} md={8}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            p: 4,
                            background: 'var(--color-surface-dark)',
                            border: '1px solid var(--color-border-glass)',
                            borderRadius: '24px',
                            height: 400,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '200px',
                                height: '200px',
                                background: 'radial-gradient(circle, rgba(216, 185, 138, 0.05) 0%, transparent 70%)',
                                borderRadius: '50%',
                            }
                        }}
                    >
                        <MuiBox sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                            <BarChart3 size={64} style={{ 
                                color: 'var(--color-text-disabled)', 
                                opacity: 0.5,
                                marginBottom: '1rem'
                            }} />
                            <MuiTypography variant="h6" sx={{ 
                                color: 'var(--color-text-secondary)', 
                                fontWeight: 500 
                            }}>
                                مخطط الحجوزات الشهري (قريباً)
                            </MuiTypography>
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>
                <MuiGrid item xs={12} md={4}>
                    <MuiPaper
                        elevation={0}
                        sx={{
                            p: 4,
                            background: 'var(--color-surface-dark)',
                            border: '1px solid var(--color-border-glass)',
                            borderRadius: '24px',
                            height: 400,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '200px',
                                height: '200px',
                                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
                                borderRadius: '50%',
                            }
                        }}
                    >
                        <MuiBox sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                            <Users size={64} style={{ 
                                color: 'var(--color-text-disabled)', 
                                opacity: 0.5,
                                marginBottom: '1rem'
                            }} />
                            <MuiTypography variant="h6" sx={{ 
                                color: 'var(--color-text-secondary)', 
                                fontWeight: 500 
                            }}>
                                توزيع أنواع المناسبات (قريباً)
                            </MuiTypography>
                        </MuiBox>
                    </MuiPaper>
                </MuiGrid>
            </MuiGrid>
        </MuiBox>
    )
}
