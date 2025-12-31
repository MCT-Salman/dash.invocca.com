// src/pages/client/ClientDashboard.jsx
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import MuiBox from '@/components/ui/MuiBox'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiTypography from '@/components/ui/MuiTypography'
import { LoadingScreen, SEOHead } from '@/components/common'
import { QUERY_KEYS } from '@/config/constants'
import { getClientDashboard } from '@/api/client'
import { formatNumber, formatDate } from '@/utils/helpers'
import { useAuth } from '@/hooks'
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  MessageCircle,
  TrendingUp,
  Clock,
  Star,
  MapPin,
  Users
} from 'lucide-react'

function StatCard({ title, value, icon: Icon, color = 'var(--color-primary-500)' }) {
  return (
    <MuiPaper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        background: 'var(--color-surface-dark)',
        border: '1px solid var(--color-border-glass)',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
          borderColor: color,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${color}, transparent)`,
        }
      }}
    >
      <MuiBox sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <MuiBox>
          <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 1, fontWeight: 500 }}>
            {title}
          </MuiTypography>
          <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
            {formatNumber(value)}
          </MuiTypography>
        </MuiBox>
        <MuiBox
          sx={{
            width: 56,
            height: 56,
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${color}`,
          }}
        >
          <Icon size={28} style={{ color }} />
        </MuiBox>
      </MuiBox>
    </MuiPaper>
  )
}

export default function ClientDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.CLIENT_DASHBOARD,
    queryFn: getClientDashboard,
  })

  if (isLoading) {
    return <LoadingScreen message="جاري تحميل لوحة التحكم..." fullScreen={false} />
  }

  // Extract data from the actual API response structure
  const responseData = data?.data || data || {}
  const summary = responseData.summary || {}
  const eventsSummary = summary.events || {}
  const invitationsSummary = summary.invitations || {}
  
  // Get events from different possible locations
  const bookings = responseData.allEvents || responseData.recentActivity?.events || responseData.events || []
  const invitations = responseData.recentActivity?.invitations || responseData.invitations || []
  
  // Calculate stats from summary or fallback to counting
  const stats = {
    totalBookings: eventsSummary.total || bookings.length,
    totalInvitations: invitationsSummary.total || invitations.length,
    upcomingEvents: eventsSummary.upcoming || bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length,
  }

  return (
    <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
      <SEOHead title="لوحة تحكم العميل - INVOCCA" />

      {/* Header */}
      <MuiBox sx={{ mb: 4 }}>
        <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700, mb: 1 }}>
          مرحباً بك، {user?.name}
        </MuiTypography>
        <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
          إليك ملخص لنشاطاتك وحجوزاتك الحالية
        </MuiTypography>
      </MuiBox>

      {/* Stats Grid */}
      <MuiGrid container spacing={3} sx={{ mb: 4 }}>
        <MuiGrid item xs={12} sm={6} md={4}>
          <StatCard
            title="إجمالي الحجوزات"
            value={stats.totalBookings}
            icon={Calendar}
            color="var(--color-primary-500)"
          />
        </MuiGrid>
        <MuiGrid item xs={12} sm={6} md={4}>
          <StatCard
            title="الدعوات النشطة"
            value={stats.totalInvitations}
            icon={ClipboardList}
            color="var(--color-secondary-500)"
          />
        </MuiGrid>
        <MuiGrid item xs={12} sm={6} md={4}>
          <StatCard
            title="المناسبات القادمة"
            value={stats.upcomingEvents}
            icon={Clock}
            color="var(--color-info-500)"
          />
        </MuiGrid>
      </MuiGrid>

      {/* Recent Bookings Placeholder */}
      <MuiGrid container spacing={3}>
        <MuiGrid item xs={12}>
          <MuiPaper
            elevation={0}
            sx={{
              p: 3,
              background: 'var(--color-surface-dark)',
              border: '1px solid var(--color-border-glass)',
              borderRadius: '16px',
            }}
          >
            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                الفعاليات الأخيرة
              </MuiTypography>
            </MuiBox>

            {bookings.length > 0 ? (
              <MuiGrid container spacing={2}>
                {bookings.slice(0, 3).map((booking) => (
                  <MuiGrid item xs={12} sm={6} md={4} key={booking._id || booking.id}>
                    <MuiPaper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--color-border-glass)',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: 'var(--color-primary-500)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        }
                      }}
                    >
                      <MuiTypography 
                        variant="subtitle1" 
                        sx={{ 
                          color: 'var(--color-text-primary-dark)', 
                          fontWeight: 600,
                          mb: 1.5
                        }}
                      >
                        {booking.name || booking.eventName || 'فعالية بدون اسم'}
                      </MuiTypography>
                      
                      <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                          <Calendar size={14} />
                          <MuiTypography variant="caption">
                            {formatDate(booking.date || booking.eventDate)}
                          </MuiTypography>
                        </MuiBox>
                        
                        {booking.hallId?.name && (
                          <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                            <MapPin size={14} />
                            <MuiTypography variant="caption">
                              {booking.hallId.name}
                            </MuiTypography>
                          </MuiBox>
                        )}
                        
                        {booking.guestCount && (
                          <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                            <Users size={14} />
                            <MuiTypography variant="caption">
                              {booking.guestCount} ضيف
                            </MuiTypography>
                          </MuiBox>
                        )}
                      </MuiBox>
                    </MuiPaper>
                  </MuiGrid>
                ))}
                {bookings.length > 3 && (
                  <MuiGrid item xs={12}>
                    <MuiBox sx={{ textAlign: 'center', pt: 2 }}>
                      <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                        و {bookings.length - 3} فعالية أخرى...
                      </MuiTypography>
                    </MuiBox>
                  </MuiGrid>
                )}
              </MuiGrid>
            ) : (
              <MuiBox sx={{ py: 4, textAlign: 'center' }}>
                <MuiTypography sx={{ color: 'var(--color-text-secondary)' }}>
                  لا توجد حجوزات حالية.
                </MuiTypography>
              </MuiBox>
            )}
          </MuiPaper>
        </MuiGrid>
      </MuiGrid>
    </MuiBox>
  )
}
