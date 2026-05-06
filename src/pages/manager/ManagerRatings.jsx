// src\pages\manager\ManagerRatings.jsx
import { useQuery } from '@tanstack/react-query'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiAvatar from '@/components/ui/MuiAvatar'
import { LoadingScreen, SEOHead, EmptyState } from '@/components/common'
import { getManagerRatings } from '@/api/manager'
import { formatDate } from '@/utils/helpers'
import { Star } from 'lucide-react'

function RatingCard({ rating }) {
    const clientName = rating.client?.name || 'عميل غير معروف'
    const eventName = rating.name || 'مناسبة غير محددة'
    const overallRating = rating.rating?.overallRating || 0
    const comment = rating.rating?.comment || ''
    const date = rating.date || rating.createdAt

    return (
        <MuiPaper
            elevation={0}
            sx={{
                p: 3,
                height: '100%',
                background: 'var(--color-paper)',
                border: '1px solid var(--color-border)',
                borderRadius: '24px',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: 'var(--color-icon)'
                }
            }}
        >
            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MuiAvatar sx={{ width: 50, height: 50, bgcolor: 'var(--color-icon)', fontWeight: 'bold' }}>{clientName.charAt(0)}</MuiAvatar>
                    <MuiBox>
                        <MuiTypography variant="subtitle1" sx={{ fontWeight: 700 }}>{clientName}</MuiTypography>
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-icon)', fontWeight: 600 }}>{eventName}</MuiTypography>
                    </MuiBox>
                </MuiBox>
                <MuiBox sx={{ px: 1.5, py: 0.5, borderRadius: '10px', bgcolor: 'rgba(216, 185, 138, 0.1)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Star size={16} fill="var(--color-icon)" stroke="var(--color-icon)" />
                    <MuiTypography sx={{ fontWeight: 800, color: 'var(--color-icon)' }}>{overallRating}</MuiTypography>
                </MuiBox>
            </MuiBox>

            {comment && (
                <MuiBox sx={{ mb: 3, p: 2, borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px dashed var(--color-border)' }}>
                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>"{comment}"</MuiTypography>
                </MuiBox>
            )}

            <MuiGrid container spacing={1} sx={{ mt: 'auto' }}>
                {[
                    { label: 'القاعة', score: rating.rating?.hallRating },
                    { label: 'الخدمة', score: rating.rating?.serviceRating },
                    { label: 'الموظفين', score: rating.rating?.staffRating },
                    { label: 'الطعام', score: rating.rating?.foodRating }
                ].map((item, idx) => (
                    <MuiGrid item xs={6} key={idx}>
                        <MuiBox sx={{ p: 1, borderRadius: '12px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 0.5 }}>{item.label}</MuiTypography>
                            <MuiTypography variant="caption" sx={{ fontWeight: 700, color: 'var(--color-icon)' }}>{item.score || 0}/5</MuiTypography>
                        </MuiBox>
                    </MuiGrid>
                ))}
            </MuiGrid>

            <MuiBox sx={{ mt: 3, pt: 2, borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>{formatDate(date)}</MuiTypography>
            </MuiBox>
        </MuiPaper>
    )
}

export default function ManagerRatings() {
  const { data, isLoading } = useQuery({
    queryKey: ['manager-ratings'],
    queryFn: getManagerRatings,
  })

  if (isLoading) return <LoadingScreen message="جاري تحميل التقييمات..." />

  const ratings = data?.data || data || []

  return (
    <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
      <SEOHead title="تقييمات العملاء | INVOCCA" />
      <MuiTypography variant="h4" sx={{ mb: 4, fontWeight: 800, color: 'var(--color-icon)' }}>تقييمات العملاء</MuiTypography>

      {ratings.length === 0 ? (
        <EmptyState icon={Star} title="لا توجد تقييمات" subtitle="لم يتم تقييم أي مناسبة بعد" />
      ) : (
        <MuiGrid container spacing={3}>
          {ratings.map((item) => (
            <MuiGrid item xs={12} md={6} lg={4} key={item._id}>
              <RatingCard rating={item} />
            </MuiGrid>
          ))}
        </MuiGrid>
      )}
    </MuiBox>
  )
}
