// src/pages/client/ClientDashboard.jsx
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import MuiBox from '@/components/ui/MuiBox'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiTypography from '@/components/ui/MuiTypography'
import { LoadingScreen, SEOHead } from '@/components/common'
import { QUERY_KEYS } from '@/config/constants'
import { getClientDashboard } from '@/api/client'
import { formatNumber, formatDate, formatCurrency } from '@/utils/helpers'
import { useAuth } from '@/hooks'
import MuiChip from '@/components/ui/MuiChip'
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  MessageCircle,
  TrendingUp,
  Clock,
  Star,
  MapPin,
  Users,
  DollarSign,
  AlertCircle,
  Mail,
  CheckCircle,
  XCircle,
  Building2,
  Tag
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
  const eventsScrollRef = useRef(null)
  const invitationsScrollRef = useRef(null)
  const [currentEventIndex, setCurrentEventIndex] = useState(0)
  const [currentInvitationIndex, setCurrentInvitationIndex] = useState(0)

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.CLIENT_DASHBOARD,
    queryFn: getClientDashboard,
  })

  // Extract data from the actual API response structure
  const responseData = data?.data || data || {}
  const summary = responseData.summary || {}
  const eventsSummary = summary.events || {}
  const invitationsSummary = summary.invitations || {}
  const financialSummary = summary.financial || {}
  const complaintsSummary = summary.complaints || {}
  const nextEvent = responseData.nextEvent
  const recentActivity = responseData.recentActivity || {}
  
  // Get events from different possible locations
  const bookings = responseData.allEvents || recentActivity.events || responseData.events || []
  const invitations = recentActivity.invitations || responseData.invitations || []
  
  // Auto scroll for events - Must be called before any conditional returns
  useEffect(() => {
    if (isLoading || bookings.length <= 3 || !eventsScrollRef.current) return
    
    const container = eventsScrollRef.current
    const itemHeight = 150 // Approximate height of each item including gap
    const maxScroll = (bookings.length - 3) * itemHeight
    
    const interval = setInterval(() => {
      setCurrentEventIndex((prev) => {
        const nextIndex = prev + 1
        const scrollPosition = nextIndex * itemHeight
        
        if (scrollPosition > maxScroll) {
          // Reset to top smoothly
          container.scrollTo({ top: 0, behavior: 'smooth' })
          return 0
        }
        
        // Scroll to next position
        container.scrollTo({ top: scrollPosition, behavior: 'smooth' })
        return nextIndex
      })
    }, 3000) // Change every 3 seconds
    
    return () => clearInterval(interval)
  }, [bookings.length, isLoading])
  
  // Auto scroll for invitations - Must be called before any conditional returns
  useEffect(() => {
    if (isLoading || invitations.length <= 3 || !invitationsScrollRef.current) return
    
    const container = invitationsScrollRef.current
    const itemHeight = 150 // Approximate height of each item including gap
    const maxScroll = (invitations.length - 3) * itemHeight
    
    const interval = setInterval(() => {
      setCurrentInvitationIndex((prev) => {
        const nextIndex = prev + 1
        const scrollPosition = nextIndex * itemHeight
        
        if (scrollPosition > maxScroll) {
          // Reset to top smoothly
          container.scrollTo({ top: 0, behavior: 'smooth' })
          return 0
        }
        
        // Scroll to next position
        container.scrollTo({ top: scrollPosition, behavior: 'smooth' })
        return nextIndex
      })
    }, 3000) // Change every 3 seconds
    
    return () => clearInterval(interval)
  }, [invitations.length, isLoading])

  if (isLoading) {
    return <LoadingScreen message="جاري تحميل لوحة التحكم..." fullScreen={false} />
  }
  
  // Event type labels
  const eventTypeLabels = {
    wedding: 'زفاف',
    birthday: 'عيد ميلاد',
    engagement: 'خطوبة',
    graduation: 'تخرج',
    corporate: 'فعالية شركات',
    other: 'أخرى'
  }

  // Status labels
  const statusLabels = {
    pending: 'قيد الانتظار',
    confirmed: 'مؤكد',
    in_progress: 'جاري',
    completed: 'مكتمل',
    cancelled: 'ملغي'
  }
  
  // Calculate stats from summary
  const stats = {
    totalBookings: eventsSummary.total || 0,
    totalInvitations: invitationsSummary.total || 0,
    upcomingEvents: eventsSummary.upcoming || 0,
    pastEvents: eventsSummary.past || 0,
    completedEvents: eventsSummary.completed || 0,
    cancelledEvents: eventsSummary.cancelled || 0,
    pendingEvents: eventsSummary.pending || 0,
    confirmedEvents: eventsSummary.confirmed || 0,
    sentInvitations: invitationsSummary.sent || 0,
    usedInvitations: invitationsSummary.used || 0,
    pendingInvitations: invitationsSummary.pending || 0,
    totalGuests: invitationsSummary.totalGuests || 0,
    checkedInGuests: invitationsSummary.checkedInGuests || 0,
    usageRate: invitationsSummary.usageRate || '0.00',
    checkInRate: invitationsSummary.checkInRate || 0,
    totalSpent: financialSummary.totalSpent || 0,
    totalPaid: financialSummary.totalPaid || 0,
    totalUnpaid: financialSummary.totalUnpaid || 0,
    currency: financialSummary.currency || 'SAR',
    totalComplaints: complaintsSummary.total || 0,
    openComplaints: complaintsSummary.open || 0,
    resolvedComplaints: complaintsSummary.resolved || 0,
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

      {/* Stats Grid - Events */}
      <MuiGrid container spacing={3} sx={{ mb: 4 }}>
        <MuiGrid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي الحجوزات"
            value={stats.totalBookings}
            icon={Calendar}
            color="var(--color-primary-500)"
          />
        </MuiGrid>
        <MuiGrid item xs={12} sm={6} md={3}>
          <StatCard
            title="المناسبات القادمة"
            value={stats.upcomingEvents}
            icon={Clock}
            color="var(--color-info-500)"
          />
        </MuiGrid>
        <MuiGrid item xs={12} sm={6} md={3}>
          <StatCard
            title="الفعاليات المكتملة"
            value={stats.completedEvents}
            icon={CheckCircle}
            color="#22c55e"
          />
        </MuiGrid>
        <MuiGrid item xs={12} sm={6} md={3}>
          <StatCard
            title="الفعاليات الملغاة"
            value={stats.cancelledEvents}
            icon={XCircle}
            color="#dc2626"
          />
        </MuiGrid>
      </MuiGrid>

      {/* Stats Grid - Invitations */}
      <MuiGrid container spacing={3} sx={{ mb: 4 }}>
        <MuiGrid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي الدعوات"
            value={stats.totalInvitations}
            icon={Mail}
            color="var(--color-secondary-500)"
          />
        </MuiGrid>
        <MuiGrid item xs={12} sm={6} md={3}>
          <StatCard
            title="الدعوات المرسلة"
            value={stats.sentInvitations}
            icon={ClipboardList}
            color="#3b82f6"
          />
        </MuiGrid>
        <MuiGrid item xs={12} sm={6} md={3}>
          <StatCard
            title="الدعوات المستخدمة"
            value={stats.usedInvitations}
            icon={CheckCircle}
            color="#22c55e"
          />
        </MuiGrid>
        <MuiGrid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي المدعوين"
            value={stats.totalGuests}
            icon={Users}
            color="var(--color-primary-500)"
          />
        </MuiGrid>
      </MuiGrid>

      {/* Stats Grid - Financial */}
      <MuiGrid container spacing={3} sx={{ mb: 4 }}>
        <MuiGrid item xs={12} sm={6} md={4}>
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
                borderColor: '#f97316',
              },
            }}
          >
            <MuiBox sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
              <MuiBox>
                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 1, fontWeight: 500 }}>
                  إجمالي المصروفات
                </MuiTypography>
                <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                  {formatNumber(stats.totalSpent)} {stats.currency || 'ر.س'}
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
                  border: '1px solid #f97316',
                }}
              >
                <DollarSign size={28} style={{ color: '#f97316' }} />
              </MuiBox>
            </MuiBox>
          </MuiPaper>
        </MuiGrid>
        <MuiGrid item xs={12} sm={6} md={4}>
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
                borderColor: '#22c55e',
              },
            }}
          >
            <MuiBox sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
              <MuiBox>
                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 1, fontWeight: 500 }}>
                  المدفوع
                </MuiTypography>
                <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                  {formatNumber(stats.totalPaid)} {stats.currency || 'ر.س'}
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
                  border: '1px solid #22c55e',
                }}
              >
                <TrendingUp size={28} style={{ color: '#22c55e' }} />
              </MuiBox>
            </MuiBox>
          </MuiPaper>
        </MuiGrid>
        <MuiGrid item xs={12} sm={6} md={4}>
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
                borderColor: '#dc2626',
              },
            }}
          >
            <MuiBox sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
              <MuiBox>
                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 1, fontWeight: 500 }}>
                  المتبقي
                </MuiTypography>
                <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                  {formatNumber(stats.totalUnpaid)} {stats.currency || 'ر.س'}
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
                  border: '1px solid #dc2626',
                }}
              >
                <DollarSign size={28} style={{ color: '#dc2626' }} />
              </MuiBox>
            </MuiBox>
          </MuiPaper>
        </MuiGrid>
      </MuiGrid>

      {/* Stats Grid - Complaints */}
      {stats.totalComplaints > 0 && (
        <MuiGrid container spacing={3} sx={{ mb: 4 }}>
          <MuiGrid item xs={12} sm={6} md={4}>
            <StatCard
              title="إجمالي الشكاوى"
              value={stats.totalComplaints}
              icon={AlertCircle}
              color="#f59e0b"
            />
          </MuiGrid>
          <MuiGrid item xs={12} sm={6} md={4}>
            <StatCard
              title="الشكاوى المفتوحة"
              value={stats.openComplaints}
              icon={AlertCircle}
              color="#dc2626"
            />
          </MuiGrid>
          <MuiGrid item xs={12} sm={6} md={4}>
            <StatCard
              title="الشكاوى المحلولة"
              value={stats.resolvedComplaints}
              icon={CheckCircle}
              color="#22c55e"
            />
          </MuiGrid>
        </MuiGrid>
      )}

      {/* Next Event */}
      {nextEvent && (
        <MuiPaper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            background: 'var(--color-surface-dark)',
            border: '1px solid var(--color-border-glass)',
            borderRadius: '20px',
          }}
        >
          <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
              الفعالية القادمة
            </MuiTypography>
            <MuiChip
              label={statusLabels[nextEvent.status] || nextEvent.status}
              size="small"
              sx={{
                backgroundColor: 'rgba(216, 185, 138, 0.1)',
                color: 'var(--color-primary-500)',
                fontWeight: 600,
              }}
            />
          </MuiBox>
          <MuiGrid container spacing={2}>
            <MuiGrid item xs={12} md={6}>
              <MuiTypography variant="h5" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700, mb: 2 }}>
                {nextEvent.name || 'فعالية بدون اسم'}
              </MuiTypography>
              <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Tag size={16} style={{ color: 'var(--color-primary-400)' }} />
                  <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                    النوع: {eventTypeLabels[nextEvent.type] || nextEvent.type || '—'}
                  </MuiTypography>
                </MuiBox>
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Calendar size={16} style={{ color: 'var(--color-primary-400)' }} />
                  <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                    التاريخ: {formatDate(nextEvent.date, 'MM/DD/YYYY')}
                  </MuiTypography>
                </MuiBox>
                {nextEvent.startTime && nextEvent.endTime && (
                  <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Clock size={16} style={{ color: 'var(--color-primary-400)' }} />
                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                      الوقت: {nextEvent.startTime} - {nextEvent.endTime}
                    </MuiTypography>
                  </MuiBox>
                )}
                {nextEvent.hall && (
                  <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Building2 size={16} style={{ color: 'var(--color-primary-400)' }} />
                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                      قاعة/صالة: {nextEvent.hall.name || '—'}
                    </MuiTypography>
                  </MuiBox>
                )}
                {nextEvent.hall?.location && (
                  <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MapPin size={16} style={{ color: 'var(--color-primary-400)' }} />
                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                      الموقع: {nextEvent.hall.location}
                    </MuiTypography>
                  </MuiBox>
                )}
                {nextEvent.guestCount && (
                  <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Users size={16} style={{ color: 'var(--color-primary-400)' }} />
                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                      عدد الضيوف: {nextEvent.guestCount}
                    </MuiTypography>
                  </MuiBox>
                )}
                {nextEvent.totalPrice !== undefined && (
                  <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DollarSign size={16} style={{ color: 'var(--color-primary-400)' }} />
                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                      السعر الإجمالي: {formatCurrency(nextEvent.totalPrice)}
                    </MuiTypography>
                  </MuiBox>
                )}
              </MuiBox>
            </MuiGrid>
            {nextEvent.template?.imageUrl && (
              <MuiGrid item xs={12} md={6}>
                <MuiBox
                  onClick={() => {
                    const imageUrl = nextEvent.template.imageUrl?.startsWith('http')
                      ? nextEvent.template.imageUrl
                      : `http://82.137.244.167:5001${nextEvent.template.imageUrl}`
                    window.open(imageUrl, '_blank')
                  }}
                  sx={{
                    width: '100%',
                    maxWidth: 400,
                    height: 300,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border-glass)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)',
                    }
                  }}
                >
                  <img
                    src={nextEvent.template.imageUrl?.startsWith('http')
                      ? nextEvent.template.imageUrl
                      : `http://82.137.244.167:5001${nextEvent.template.imageUrl}`}
                    alt="قالب الفعالية"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </MuiBox>
              </MuiGrid>
            )}
          </MuiGrid>
        </MuiPaper>
      )}

      {/* Recent Activity */}
      <MuiGrid container spacing={3} sx={{ mb: 4 }}>
        {/* Recent Events */}
        <MuiGrid item xs={12} md={6}>
          <MuiPaper
            elevation={0}
            sx={{
              p: 3,
              background: 'var(--color-surface-dark)',
              border: '1px solid var(--color-border-glass)',
              borderRadius: '16px',
              height: '100%',
            }}
          >
            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                الفعاليات الأخيرة
              </MuiTypography>
            </MuiBox>

            {bookings.length > 0 ? (
              <MuiBox 
                ref={eventsScrollRef}
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 2,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  maxHeight: '450px',
                  position: 'relative',
                  scrollBehavior: 'smooth',
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'var(--color-border-glass)',
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: 'var(--color-primary-500)',
                  },
                }}
              >
                {bookings.map((booking, idx) => (
                    <MuiPaper
                      key={booking._id || booking.id || idx}
                      elevation={0}
                      sx={{
                        p: 2,
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--color-border-glass)',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        flexShrink: 0,
                        minHeight: '120px',
                        '&:hover': {
                          borderColor: 'var(--color-primary-500)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        }
                      }}
                      onClick={() => navigate(`/client/bookings/${booking._id || booking.id}`)}
                    >
                    <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <MuiTypography 
                        variant="subtitle1" 
                        sx={{ 
                          color: 'var(--color-text-primary-dark)', 
                          fontWeight: 600,
                        }}
                      >
                        {booking.name || booking.eventName || 'فعالية بدون اسم'}
                      </MuiTypography>
                      <MuiChip
                        label={statusLabels[booking.status] || booking.status}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(216, 185, 138, 0.1)',
                          color: 'var(--color-primary-400)',
                          fontSize: '0.7rem',
                          height: 20
                        }}
                      />
                    </MuiBox>
                    
                    <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                        <Calendar size={12} />
                        <MuiTypography variant="caption">
                          {formatDate(booking.date || booking.eventDate, 'MM/DD/YYYY')}
                        </MuiTypography>
                      </MuiBox>
                      
                      {booking.hall?.name && (
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                          <MapPin size={12} />
                          <MuiTypography variant="caption">
                            {booking.hall.name}
                          </MuiTypography>
                        </MuiBox>
                      )}
                      
                      {booking.guestCount && (
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                          <Users size={12} />
                          <MuiTypography variant="caption">
                            {booking.guestCount} ضيف
                          </MuiTypography>
                        </MuiBox>
                      )}
                    </MuiBox>
                  </MuiPaper>
                ))}
              </MuiBox>
            ) : (
              <MuiBox sx={{ py: 4, textAlign: 'center' }}>
                <MuiTypography sx={{ color: 'var(--color-text-secondary)' }}>
                  لا توجد فعاليات حالية.
                </MuiTypography>
              </MuiBox>
            )}
          </MuiPaper>
        </MuiGrid>

        {/* Recent Invitations */}
        <MuiGrid item xs={12} md={6}>
          <MuiPaper
            elevation={0}
            sx={{
              p: 3,
              background: 'var(--color-surface-dark)',
              border: '1px solid var(--color-border-glass)',
              borderRadius: '16px',
              height: '100%',
            }}
          >
            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
                الدعوات الأخيرة
              </MuiTypography>
            </MuiBox>

            {invitations.length > 0 ? (
              <MuiBox 
                ref={invitationsScrollRef}
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 2,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  maxHeight: '450px',
                  position: 'relative',
                  scrollBehavior: 'smooth',
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'var(--color-border-glass)',
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: 'var(--color-primary-500)',
                  },
                }}
              >
                {invitations.map((invitation, idx) => (
                    <MuiPaper
                      key={invitation._id || invitation.id || idx}
                      elevation={0}
                      sx={{
                        p: 2,
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--color-border-glass)',
                        borderRadius: '12px',
                        flexShrink: 0,
                        minHeight: '120px',
                      }}
                    >
                    <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <MuiTypography 
                        variant="subtitle1" 
                        sx={{ 
                          color: 'var(--color-text-primary-dark)', 
                          fontWeight: 600,
                        }}
                      >
                        {invitation.guestName || 'دعوة بدون اسم'}
                      </MuiTypography>
                      <MuiChip
                        label={invitation.status === 'sent' ? 'مرسلة' : invitation.status}
                        size="small"
                        sx={{
                          backgroundColor: invitation.status === 'sent' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(216, 185, 138, 0.1)',
                          color: invitation.status === 'sent' ? '#22c55e' : 'var(--color-primary-400)',
                          fontSize: '0.7rem',
                          height: 20
                        }}
                      />
                    </MuiBox>
                    
                    <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {invitation.eventId && (
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                          <Calendar size={12} />
                          <MuiTypography variant="caption">
                            {typeof invitation.eventId === 'object' ? invitation.eventId.name : '—'}
                          </MuiTypography>
                        </MuiBox>
                      )}
                      {invitation.eventDate && (
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                          <Calendar size={12} />
                          <MuiTypography variant="caption">
                            {formatDate(invitation.eventDate, 'MM/DD/YYYY')}
                          </MuiTypography>
                        </MuiBox>
                      )}
                      {invitation.numOfPeople && (
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                          <Users size={12} />
                          <MuiTypography variant="caption">
                            {invitation.numOfPeople} شخص
                          </MuiTypography>
                        </MuiBox>
                      )}
                      {invitation.qrCode && (
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                          <MuiTypography variant="caption">
                            رمز QR: {invitation.qrCode}
                          </MuiTypography>
                        </MuiBox>
                      )}
                      {invitation.used !== undefined && (
                        <MuiChip
                          label={invitation.used ? 'مستخدمة' : 'غير مستخدمة'}
                          size="small"
                          sx={{
                            mt: 0.5,
                            backgroundColor: invitation.used ? 'rgba(249, 115, 22, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                            color: invitation.used ? '#f97316' : '#3b82f6',
                            fontSize: '0.7rem',
                            height: 18,
                            width: 'fit-content'
                          }}
                        />
                      )}
                    </MuiBox>
                  </MuiPaper>
                ))}
              </MuiBox>
            ) : (
              <MuiBox sx={{ py: 4, textAlign: 'center' }}>
                <MuiTypography sx={{ color: 'var(--color-text-secondary)' }}>
                  لا توجد دعوات حالية.
                </MuiTypography>
              </MuiBox>
            )}
          </MuiPaper>
        </MuiGrid>
      </MuiGrid>
    </MuiBox>
  )
}
