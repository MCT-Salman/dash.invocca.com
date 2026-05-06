// src/pages/client/Bookings.jsx
import { useQuery } from '@tanstack/react-query'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiChip from '@/components/ui/MuiChip'
import { LoadingScreen, EmptyState, SEOHead } from '@/components/common'
import { QUERY_KEYS, EVENT_STATUS_LABELS, EVENT_STATUS_COLORS } from '@/config/constants'
import { getBookings } from '@/api/client'
import { formatDate } from '@/utils/helpers'
import { Calendar, MapPin, Users } from 'lucide-react'
import MuiButton from '@/components/ui/MuiButton'
import { useNavigate } from 'react-router-dom'

export default function Bookings() {
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.CLIENT_BOOKINGS,
    queryFn: getBookings,
  })

  if (isLoading) return <LoadingScreen message="جاري تحميل الحجوزات..." />

  const bookings = data?.bookings || data?.data || []

  return (
    <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
      <SEOHead title="حجوزاتي | INVOCCA" />

      <MuiBox sx={{ mb: 4 }}>
        <MuiTypography variant="h4" sx={{ color: 'var(--color-icon)', fontWeight: 800, mb: 1 }}>حجوزاتي</MuiTypography>
        <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>إدارة ومتابعة طلبات الحجز الخاصة بك</MuiTypography>
      </MuiBox>

      {bookings.length > 0 ? (
        <MuiGrid container spacing={3}>
          {bookings.map((booking) => (
            <MuiGrid item xs={12} md={6} key={booking._id}>
              <MuiPaper sx={{ p: 3, borderRadius: '24px', background: 'var(--color-paper)', border: '1px solid var(--color-border)' }}>
                <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <MuiTypography variant="h6" sx={{ fontWeight: 700 }}>{booking.name || 'حجز بدون اسم'}</MuiTypography>
                  <MuiChip label={EVENT_STATUS_LABELS[booking.status] || booking.status} color={EVENT_STATUS_COLORS[booking.status] || 'default'} size="small" />
                </MuiBox>
                <MuiGrid container spacing={2}>
                  <MuiGrid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Calendar size={16} color="var(--color-icon)" />
                    <MuiTypography variant="body2">{formatDate(booking.date)}</MuiTypography>
                  </MuiGrid>
                  <MuiGrid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Users size={16} color="var(--color-icon)" />
                    <MuiTypography variant="body2">{booking.guestCount} ضيف</MuiTypography>
                  </MuiGrid>
                  <MuiGrid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MapPin size={16} color="var(--color-icon)" />
                    <MuiTypography variant="body2">{booking.hallId?.name || 'قاعة غير محددة'}</MuiTypography>
                  </MuiGrid>
                </MuiGrid>
                <MuiBox sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <MuiButton variant="outlined" size="small" onClick={() => navigate('/client/ratings')}>عرض التقييم</MuiButton>
                </MuiBox>
              </MuiPaper>
            </MuiGrid>
          ))}
        </MuiGrid>
      ) : (
        <EmptyState title="لا توجد حجوزات" subtitle="لم تقم بإجراء أي حجوزات بعد" icon={Calendar} />
      )}
    </MuiBox>
  )
}
