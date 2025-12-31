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
import { Calendar, MapPin, Users, Clock } from 'lucide-react'

export default function Bookings() {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.CLIENT_BOOKINGS,
    queryFn: () => getBookings(),
  })

  if (isLoading) {
    return <LoadingScreen message="جاري تحميل الحجوزات..." fullScreen={false} />
  }

  const bookings = data?.bookings || data?.data || []

  return (
    <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
      <SEOHead title="حجوزاتي - INVOCCA" />

      <MuiBox sx={{ mb: 4 }}>
        <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700, mb: 1 }}>
          حجوزاتي
        </MuiTypography>
        <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
          إدارة ومتابعة طلبات الحجز الخاصة بك
        </MuiTypography>
      </MuiBox>

      {bookings.length > 0 ? (
        <MuiGrid container spacing={3}>
          {bookings.map((booking) => (
            <MuiGrid item xs={12} md={6} key={booking._id}>
              <MuiPaper
                elevation={0}
                sx={{
                  p: 3,
                  background: 'var(--color-surface-dark)',
                  border: '1px solid var(--color-border-glass)',
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'var(--color-primary-500)',
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                    {booking.name || 'حجز بدون اسم'}
                  </MuiTypography>
                  <MuiChip
                    label={EVENT_STATUS_LABELS[booking.status] || booking.status}
                    color={EVENT_STATUS_COLORS[booking.status] || 'default'}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </MuiBox>

                <MuiGrid container spacing={2}>
                  <MuiGrid item xs={6}>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                      <Calendar size={16} />
                      <MuiTypography variant="body2">
                        {formatDate(booking.date)}
                      </MuiTypography>
                    </MuiBox>
                  </MuiGrid>
                  <MuiGrid item xs={6}>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                      <Users size={16} />
                      <MuiTypography variant="body2">
                        {booking.guestCount} ضيف
                      </MuiTypography>
                    </MuiBox>
                  </MuiGrid>
                  <MuiGrid item xs={12}>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                      <MapPin size={16} />
                      <MuiTypography variant="body2">
                        {booking.hallId?.name || '—'}
                      </MuiTypography>
                    </MuiBox>
                  </MuiGrid>
                </MuiGrid>
              </MuiPaper>
            </MuiGrid>
          ))}
        </MuiGrid>
      ) : (
        <EmptyState
          title="لا توجد حجوزات"
          description="لم تقم بإجراء أي حجوزات بعد."
          icon={Calendar}
        />
      )}
    </MuiBox>
  )
}
