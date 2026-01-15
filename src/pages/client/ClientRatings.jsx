// src/pages/client/ClientRatings.jsx
import React from 'react'
import { Star, Building2, Sparkles, Users, Utensils, MessageSquare } from 'lucide-react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getBookings, getClientReports } from '@/api/client'
import { getEventRating, updateEventRating } from '@/api/client'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiButton from '@/components/ui/MuiButton'
import MuiRating from '@/components/ui/MuiRating'
import { LoadingScreen, FormDialog, EmptyState, SEOHead } from '@/components/common'
import MuiTextField from '@/components/ui/MuiTextField'
import { addEventRating } from '@/api/client'
import { useNotification } from '@/hooks'
import { QUERY_KEYS } from '@/config/constants'
import { formatDate } from '@/utils/helpers'

export default function ClientRatings() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: QUERY_KEYS.CLIENT_BOOKINGS, queryFn: () => getBookings() })

  const { data: reportsData } = useQuery({
    queryKey: QUERY_KEYS.CLIENT_REPORTS,
    queryFn: getClientReports,
  })

  // Merge bookings from getBookings and the event from getClientReports
  const bookings = React.useMemo(() => {
    const directBookings = data?.bookings || data?.data || []
    const reportEvent = reportsData?.event

    if (!reportEvent) return directBookings

    // Check if reportEvent is already in directBookings
    const exists = directBookings.some(b =>
      (b._id === reportEvent._id) || (b.id === reportEvent._id) || (b._id === reportEvent.id)
    )

    if (exists) return directBookings

    // Add reportEvent to the list
    return [...directBookings, reportEvent]
  }, [data, reportsData])

  const [openDialog, setOpenDialog] = React.useState(false)
  const [currentEventId, setCurrentEventId] = React.useState(null)

  const { data: ratingResp, refetch: refetchRating, isFetching: ratingFetching } = useQuery({
    queryKey: ['client-event-rating', currentEventId],
    queryFn: () => getEventRating(currentEventId),
    enabled: !!currentEventId,
  })

  const { addNotification } = useNotification()

  const [ratingData, setRatingData] = React.useState({
    overallRating: 0,
    hallRating: 0,
    serviceRating: 0,
    foodRating: 0,
    staffRating: 0,
    comment: '',
  })
  const [hasExistingRating, setHasExistingRating] = React.useState(false)
  const [canBeRated, setCanBeRated] = React.useState(false)

  const addRatingMutation = useMutation({
    mutationFn: (payload) => addEventRating(currentEventId, payload),
    onSuccess: (res) => {
      addNotification({ type: 'success', title: 'تم بنجاح', message: res?.message || 'تم إضافة التقييم بنجاح' })
      queryClient.invalidateQueries({ queryKey: ['client-event-rating', currentEventId] })
      setOpenDialog(false)
    },
    onError: (error) => {
      addNotification({ type: 'error', title: 'خطأ', message: error?.response?.data?.message || error?.message || 'حدث خطأ أثناء إرسال التقييم' })
    }
  })

  const updateRatingMutation = useMutation({
    mutationFn: (payload) => updateEventRating(currentEventId, payload),
    onSuccess: (res) => {
      addNotification({ type: 'success', title: 'تم بنجاح', message: res?.message || 'تم تحديث التقييم بنجاح' })
      queryClient.invalidateQueries({ queryKey: ['client-event-rating', currentEventId] })
      setOpenDialog(false)
    },
    onError: (error) => {
      addNotification({ type: 'error', title: 'خطأ', message: error?.response?.data?.message || error?.message || 'حدث خطأ أثناء تحديث التقييم' })
    }
  })

  const handleOpen = (eventId) => {
    setCurrentEventId(eventId)
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
    setCurrentEventId(null)
  }

  React.useEffect(() => {
    const rating = ratingResp?.data
    const canRate = ratingResp?.canBeRated ?? false
    setCanBeRated(canRate)

    // Also consider editable if there is an existing rating, unless logic dictates otherwise
    // For now, if they have a rating, we let them edit it.

    if (rating && typeof rating === 'object') {
      setHasExistingRating(true)
      setRatingData({
        overallRating: rating.overallRating ?? 0,
        hallRating: rating.hallRating ?? 0,
        serviceRating: rating.serviceRating ?? 0,
        foodRating: rating.foodRating ?? 0,
        staffRating: rating.staffRating ?? 0,
        comment: rating.comment || '',
      })
    } else {
      setHasExistingRating(false)
      setRatingData({
        overallRating: 0,
        hallRating: 0,
        serviceRating: 0,
        foodRating: 0,
        staffRating: 0,
        comment: '',
      })
    }
  }, [ratingResp])

  const handleRatingChange = (field) => (value) => {
    setRatingData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRatingCommentChange = (e) => {
    const { value } = e.target
    setRatingData((prev) => ({ ...prev, comment: value }))
  }

  const handleSubmitRating = () => {
    const payload = {
      overallRating: ratingData.overallRating,
      hallRating: ratingData.hallRating,
      serviceRating: ratingData.serviceRating,
      foodRating: ratingData.foodRating,
      staffRating: ratingData.staffRating,
      comment: ratingData.comment?.trim() || '',
    }

    if (hasExistingRating) {
      updateRatingMutation.mutate(payload)
    } else {
      addRatingMutation.mutate(payload)
    }
  }

  if (isLoading) return <LoadingScreen message="جاري تحميل الحجوزات..." fullScreen={false} />

  return (
    <MuiBox sx={{ p: 3, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
      <SEOHead pageKey="clientRatings" title="تقييماتي | INVOCCA" />

      <MuiTypography variant="h4" sx={{ mb: 4 }}>تقييماتي</MuiTypography>

      {bookings.length > 0 ? (
        <MuiGrid container spacing={3}>
          {bookings.map((b) => {
            const eventId = b._id || b.id || b.event?._id || b.event?.id
            const eventName = b.name || b.eventName || b.event?.name || 'مناسبة'
            const eventDate = b.date || b.eventDate || b.event?.date

            return (
              <MuiGrid item xs={12} md={6} lg={4} key={eventId}>
                <MuiPaper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                  <MuiTypography variant="h6">{eventName}</MuiTypography>
                  <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>{formatDate(eventDate)}</MuiTypography>
                  <MuiBox sx={{ mt: 2 }}>
                    <MuiButton onClick={() => handleOpen(eventId)} variant="contained" startIcon={<Star size={18} />}>
                      تقييم الفعالية
                    </MuiButton>
                  </MuiBox>
                </MuiPaper>
              </MuiGrid>
            )
          })}
        </MuiGrid>
      ) : (
        <EmptyState title="لا توجد مناسبات" description="لا توجد مناسبات لعرض التقييمات." icon={() => null} />
      )}

      <FormDialog
        open={openDialog}
        onClose={handleClose}
        title="تقييم الفعالية"
        submitText="حفظ التقييم"
        onSubmit={handleSubmitRating}
        loading={addRatingMutation.isPending || updateRatingMutation.isPending}
      >
        {ratingFetching ? (
          <LoadingScreen message="جاري تحميل التقييم..." fullScreen={false} />
        ) : (
          <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* Overall Rating Hero Section */}
            <MuiPaper
              elevation={0}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1.5,
                background: 'linear-gradient(145deg, rgba(216, 185, 138, 0.1) 0%, rgba(0, 0, 0, 0) 100%)',
                border: '1px solid rgba(212, 155, 85, 0.5)', // Light shade of primary-400 (#D49B55)
                borderRadius: '16px'
              }}
            >
              <MuiTypography variant="h6" sx={{ color: 'var(--color-primary-400)', fontWeight: 600 }}>
                التقييم العام
              </MuiTypography>
              <MuiRating
                value={ratingData.overallRating}
                onChange={handleRatingChange('overallRating')}
                size="large"
                sx={{
                  fontSize: '3rem',
                  '& .MuiRating-iconEmpty': {
                    color: 'rgba(212, 155, 85, 0.5)',
                  }
                }}
              />
              <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                كيف كانت تجربتك بشكل عام؟
              </MuiTypography>
            </MuiPaper>

            <MuiGrid container spacing={2}>
              {/* Hall Rating */}
              <MuiGrid item xs={12} sm={6}>
                <MuiBox sx={{ p: 2, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border-glass)' }}>
                  <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Building2 size={18} color="var(--color-text-secondary)" />
                    <MuiTypography variant="body2" sx={{ fontWeight: 500 }}>تقييم القاعة</MuiTypography>
                  </MuiBox>
                  <MuiRating value={ratingData.hallRating} onChange={handleRatingChange('hallRating')} size="medium" />
                </MuiBox>
              </MuiGrid>

              {/* Service Rating */}
              <MuiGrid item xs={12} sm={6}>
                <MuiBox sx={{ p: 2, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border-glass)' }}>
                  <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Sparkles size={18} color="var(--color-text-secondary)" />
                    <MuiTypography variant="body2" sx={{ fontWeight: 500 }}>تقييم الخدمة</MuiTypography>
                  </MuiBox>
                  <MuiRating value={ratingData.serviceRating} onChange={handleRatingChange('serviceRating')} size="medium" />
                </MuiBox>
              </MuiGrid>

              {/* Staff Rating */}
              <MuiGrid item xs={12} sm={6}>
                <MuiBox sx={{ p: 2, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border-glass)' }}>
                  <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Users size={18} color="var(--color-text-secondary)" />
                    <MuiTypography variant="body2" sx={{ fontWeight: 500 }}>تقييم الموظفين</MuiTypography>
                  </MuiBox>
                  <MuiRating value={ratingData.staffRating} onChange={handleRatingChange('staffRating')} size="medium" />
                </MuiBox>
              </MuiGrid>

              {/* Food Rating */}
              <MuiGrid item xs={12} sm={6}>
                <MuiBox sx={{ p: 2, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border-glass)' }}>
                  <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Utensils size={18} color="var(--color-text-secondary)" />
                    <MuiTypography variant="body2" sx={{ fontWeight: 500 }}>تقييم الطعام</MuiTypography>
                  </MuiBox>
                  <MuiRating value={ratingData.foodRating} onChange={handleRatingChange('foodRating')} size="medium" />
                </MuiBox>
              </MuiGrid>
            </MuiGrid>

            {/* Comment Section */}
            <MuiBox>
              <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <MessageSquare size={18} color="var(--color-primary-400)" />
                <MuiTypography variant="body2" sx={{ color: 'var(--color-primary-400)', fontWeight: 600 }}>
                  ملاحظات إضافية
                </MuiTypography>
              </MuiBox>
              <MuiTextField
                fullWidth
                multiline
                minRows={3}
                placeholder="شاركنا رأيك وملاحظاتك لتحسين خدماتنا..."
                value={ratingData.comment}
                onChange={handleRatingCommentChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    '& fieldset': {
                      borderColor: 'rgba(212, 155, 85, 0.5)', // Light shade of primary-400
                    },
                    '&:hover fieldset': {
                      borderColor: 'var(--color-primary-400)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'var(--color-primary-400)',
                    }
                  }
                }}
              />
            </MuiBox>
          </MuiBox>
        )}
      </FormDialog>
    </MuiBox>
  )
}
