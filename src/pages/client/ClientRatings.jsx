// src/pages/client/ClientRatings.jsx
import React from 'react'
import { Star, Building2, Sparkles, Users, Utensils, MessageSquare } from 'lucide-react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getBookings, getClientReports, getEventRating, updateEventRating, addEventRating } from '@/api/client'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiButton from '@/components/ui/MuiButton'
import MuiRating from '@/components/ui/MuiRating'
import { LoadingScreen, FormDialog, EmptyState, SEOHead } from '@/components/common'
import MuiTextField from '@/components/ui/MuiTextField'
import { useNotification } from '@/hooks'
import { QUERY_KEYS } from '@/config/constants'
import { formatDate } from '@/utils/helpers'

export default function ClientRatings() {
  const queryClient = useQueryClient()
  const { addNotification } = useNotification()
  const [openDialog, setOpenDialog] = React.useState(false)
  const [currentEventId, setCurrentEventId] = React.useState(null)

  const { data: bookingsData, isLoading } = useQuery({ 
    queryKey: QUERY_KEYS.CLIENT_BOOKINGS, 
    queryFn: getBookings 
  })

  const { data: reportsData } = useQuery({
    queryKey: QUERY_KEYS.CLIENT_REPORTS,
    queryFn: getClientReports,
  })

  const bookings = React.useMemo(() => {
    const directBookings = bookingsData?.bookings || bookingsData?.data || []
    const reportEvent = reportsData?.event
    if (!reportEvent) return directBookings
    const exists = directBookings.some(b => (b._id || b.id) === (reportEvent._id || reportEvent.id))
    return exists ? directBookings : [...directBookings, reportEvent]
  }, [bookingsData, reportsData])

  const { data: ratingResp, isFetching: ratingFetching } = useQuery({
    queryKey: ['client-event-rating', currentEventId],
    queryFn: () => getEventRating(currentEventId),
    enabled: !!currentEventId,
  })

  const [ratingData, setRatingData] = React.useState({
    overallRating: 0,
    hallRating: 0,
    serviceRating: 0,
    foodRating: 0,
    staffRating: 0,
    comment: '',
  })
  const [hasExistingRating, setHasExistingRating] = React.useState(false)

  React.useEffect(() => {
    const rating = ratingResp?.data || ratingResp
    if (rating && typeof rating === 'object' && rating.overallRating !== undefined) {
      setHasExistingRating(true)
      setRatingData({
        overallRating: rating.overallRating || 0,
        hallRating: rating.hallRating || 0,
        serviceRating: rating.serviceRating || 0,
        foodRating: rating.foodRating || 0,
        staffRating: rating.staffRating || 0,
        comment: rating.comment || '',
      })
    } else {
      setHasExistingRating(false)
      setRatingData({ overallRating: 0, hallRating: 0, serviceRating: 0, foodRating: 0, staffRating: 0, comment: '' })
    }
  }, [ratingResp])

  const addRatingMutation = useMutation({
    mutationFn: (payload) => addEventRating(currentEventId, payload),
    onSuccess: () => {
      addNotification({ type: 'success', title: 'تمت الإضافة', message: 'تمت إضافة تقييمك بنجاح' })
      queryClient.invalidateQueries({ queryKey: ['client-event-rating', currentEventId] })
      setOpenDialog(false)
    },
    onError: (err) => addNotification({ type: 'error', title: 'خطأ', message: err.message || 'حدث خطأ ما' })
  })

  const updateRatingMutation = useMutation({
    mutationFn: (payload) => updateEventRating(currentEventId, payload),
    onSuccess: () => {
      addNotification({ type: 'success', title: 'تم التحديث', message: 'تم تحديث تقييمك بنجاح' })
      queryClient.invalidateQueries({ queryKey: ['client-event-rating', currentEventId] })
      setOpenDialog(false)
    },
    onError: (err) => addNotification({ type: 'error', title: 'خطأ', message: err.message || 'حدث خطأ ما' })
  })

  if (isLoading) return <LoadingScreen message="جاري تحميل البيانات..." />

  return (
    <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
      <SEOHead title="التقييمات | INVOCCA" />
      <MuiTypography variant="h4" sx={{ mb: 4, fontWeight: 800, color: 'var(--color-icon)' }}>التقييمات</MuiTypography>

      {bookings.length > 0 ? (
        <MuiGrid container spacing={3}>
          {bookings.map((b) => {
            const eventId = b._id || b.id || b.event?._id || b.event?.id
            const eventName = b.name || b.eventName || b.event?.name || 'مناسبة'
            return (
              <MuiGrid item xs={12} md={6} lg={4} key={eventId}>
                <MuiPaper sx={{ p: 3, borderRadius: '24px', background: 'var(--color-paper)', border: '1px solid var(--color-border)' }}>
                  <MuiTypography variant="h6" sx={{ fontWeight: 700 }}>{eventName}</MuiTypography>
                  <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 2 }}>{formatDate(b.date || b.eventDate || b.event?.date)}</MuiTypography>
                  <MuiButton onClick={() => { setCurrentEventId(eventId); setOpenDialog(true); }} variant="contained" startIcon={<Star size={18} />} fullWidth>تقييم الفعالية</MuiButton>
                </MuiPaper>
              </MuiGrid>
            )
          })}
        </MuiGrid>
      ) : (
        <EmptyState icon={Star} title="لا توجد مناسبات" subtitle="لم تقم بحجز أي مناسبة بعد" />
      )}

      <FormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        title="تقييم الفعالية"
        submitText={hasExistingRating ? 'تحديث التقييم' : 'إرسال التقييم'}
        onSubmit={() => (hasExistingRating ? updateRatingMutation.mutate(ratingData) : addRatingMutation.mutate(ratingData))}
        loading={addRatingMutation.isPending || updateRatingMutation.isPending}
      >
        {ratingFetching ? (
          <LoadingScreen message="جاري التحميل..." />
        ) : (
          <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <MuiPaper sx={{ p: 3, textAlign: 'center', background: 'rgba(216, 185, 138, 0.05)', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
              <MuiTypography variant="subtitle1" sx={{ color: 'var(--color-icon)', fontWeight: 700, mb: 1 }}>التقييم العام</MuiTypography>
              <MuiRating value={ratingData.overallRating} onChange={(e, v) => setRatingData(p => ({ ...p, overallRating: v }))} size="large" />
            </MuiPaper>
            <MuiGrid container spacing={2}>
              {[
                { field: 'hallRating', label: 'القاعة', icon: Building2 },
                { field: 'serviceRating', label: 'الخدمة', icon: Sparkles },
                { field: 'staffRating', label: 'الموظفين', icon: Users },
                { field: 'foodRating', label: 'الطعام', icon: Utensils }
              ].map(item => (
                <MuiGrid item xs={12} sm={6} key={item.field}>
                  <MuiBox sx={{ p: 2, borderRadius: '12px', border: '1px solid var(--color-border)', bgcolor: 'rgba(255,255,255,0.02)' }}>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <item.icon size={16} color="var(--color-text-secondary)" />
                      <MuiTypography variant="body2" sx={{ fontWeight: 600 }}>{item.label}</MuiTypography>
                    </MuiBox>
                    <MuiRating value={ratingData[item.field]} onChange={(e, v) => setRatingData(p => ({ ...p, [item.field]: v }))} />
                  </MuiBox>
                </MuiGrid>
              ))}
            </MuiGrid>
            <MuiTextField fullWidth multiline minRows={3} label="ملاحظات إضافية" value={ratingData.comment} onChange={(e) => setRatingData(p => ({ ...p, comment: e.target.value }))} />
          </MuiBox>
        )}
      </FormDialog>
    </MuiBox>
  )
}
