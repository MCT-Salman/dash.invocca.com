// src/pages/manager/ManagerRatings.jsx
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiAvatar from '@/components/ui/MuiAvatar'
import { LoadingScreen, SEOHead, EmptyState } from '@/components/common'
import { getManagerRatings, getManagerEventRating } from '@/api/manager'
import { formatDate } from '@/utils/helpers'
import { Star } from 'lucide-react'

/**
 * Enhanced Rating Card Component
 */
function RatingCard({ rating }) {
    const clientName = rating.client?.name || 'عميل غير معروف'
    const eventName = rating.name || 'فعالية غير محددة'
    const overallRating = rating.rating?.overallRating || 0
    const comment = rating.rating?.comment || ''
    const date = rating.date || rating.createdAt

    const getScoreColor = (score) => {
        if (!score || score === '—') return 'var(--color-text-secondary)'
        if (score >= 4) return '#22c55e'
        if (score >= 3) return '#fbbf24'
        return '#ef4444'
    }

    return (
        <MuiPaper
            elevation={0}
            sx={{
                p: 3,
                height: '100%',
                background: 'var(--color-paper)',
                border: '1px solid var(--color-border-glass)',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)',
                    borderColor: 'var(--color-primary-500)'
                }
            }}
        >
            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MuiAvatar sx={{ 
                        width: 50, 
                        height: 50, 
                        background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)'
                    }}>
                        {clientName.charAt(0)}
                    </MuiAvatar>
                    <MuiBox>
                        <MuiTypography variant="subtitle1" sx={{ fontWeight: 800, color: 'var(--color-text-primary)' }}>
                            {clientName}
                        </MuiTypography>
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-primary-400)', fontWeight: 600 }}>
                            {eventName}
                        </MuiTypography>
                    </MuiBox>
                </MuiBox>
                
                <MuiBox sx={{ 
                    px: 1.5, 
                    py: 0.5, 
                    borderRadius: '10px', 
                    background: 'rgba(251, 191, 36, 0.1)', 
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                }}>
                    <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                    <MuiTypography sx={{ fontWeight: 800, color: '#fbbf24', fontSize: '1rem' }}>
                        {overallRating}
                    </MuiTypography>
                </MuiBox>
            </MuiBox>

            {comment && (
                <MuiBox sx={{ 
                    mb: 3, 
                    p: 2, 
                    borderRadius: '16px', 
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px dashed rgba(216, 185, 138, 0.2)',
                    position: 'relative'
                }}>
                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontStyle: 'italic', lineHeight: 1.7 }}>
                        "{comment}"
                    </MuiTypography>
                </MuiBox>
            )}

            <MuiGrid container spacing={2} sx={{ mt: 'auto' }}>
                {[
                    { label: 'القاعة', score: rating.rating?.hallRating },
                    { label: 'الخدمة', score: rating.rating?.serviceRating },
                    { label: 'الموظفين', score: rating.rating?.staffRating },
                    { label: 'الطعام', score: rating.rating?.foodRating }
                ].map((item, idx) => (
                    <MuiGrid item xs={6} key={idx}>
                        <MuiBox sx={{ 
                            p: 1.5, 
                            borderRadius: '12px', 
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            textAlign: 'center'
                        }}>
                            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', mb: 0.5, display: 'block' }}>
                                {item.label}
                            </MuiTypography>
                            <MuiTypography variant="body2" sx={{ fontWeight: 700, color: getScoreColor(item.score) }}>
                                {item.score ? `${item.score}/5` : '—'}
                            </MuiTypography>
                        </MuiBox>
                    </MuiGrid>
                ))}
            </MuiGrid>

            <MuiBox sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.05)', textAlign: 'center' }}>
                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                    {formatDate(date)}
                </MuiTypography>
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

  const ratings = data?.data || []

  return (
    <MuiBox sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: '100vh', background: 'var(--color-bg)' }}>
      <SEOHead pageKey="managerRatings" title="تقييمات العملاء | INVOCCA" />

      <MuiTypography variant="h4" sx={{ mb: 4, fontWeight: 700, color: 'var(--color-text-primary)' }}>
        تقييمات العملاء
      </MuiTypography>

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
