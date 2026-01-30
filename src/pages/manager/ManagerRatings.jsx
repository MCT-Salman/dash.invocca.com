// src/pages/manager/ManagerRatings.jsx
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiPaper from '@/components/ui/MuiPaper'
import { LoadingScreen, SEOHead, EmptyState } from '@/components/common'
import { getManagerRatings, getManagerEventRating } from '@/api/manager'
import { formatDate } from '@/utils/helpers'
import { Star } from 'lucide-react'

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
              <MuiPaper elevation={0} sx={{ p: 3, borderRadius: '12px' }}>
                <MuiBox sx={{ mb: 1 }}>
                  <MuiTypography variant="h6" sx={{ fontWeight: 700 }}>
                    {item.name}
                  </MuiTypography>
                  <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                    {item.client?.name} — {formatDate(item.date)}
                  </MuiTypography>
                </MuiBox>

                <MuiBox sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Star size={18} style={{ color: '#fbbf24', marginRight: 8 }} />
                  <MuiTypography variant="h5" sx={{ fontWeight: 700 }}>
                    {item.rating?.overallRating}/5
                  </MuiTypography>
                </MuiBox>

                <MuiTypography variant="body2" sx={{ mb: 1 }}>
                  {item.rating?.comment}
                </MuiTypography>

                <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <MuiBox>
                    <MuiTypography variant="caption">القاعة</MuiTypography>
                    <MuiTypography variant="h6">{item.rating?.hallRating}/5</MuiTypography>
                  </MuiBox>
                  <MuiBox>
                    <MuiTypography variant="caption">الخدمة</MuiTypography>
                    <MuiTypography variant="h6">{item.rating?.serviceRating || '—'}/5</MuiTypography>
                  </MuiBox>
                  <MuiBox>
                    <MuiTypography variant="caption">الموظفين</MuiTypography>
                    <MuiTypography variant="h6">{item.rating?.staffRating}/5</MuiTypography>
                  </MuiBox>
                  <MuiBox>
                    <MuiTypography variant="caption">الطعام</MuiTypography>
                    <MuiTypography variant="h6">{item.rating?.foodRating}/5</MuiTypography>
                  </MuiBox>
                </MuiBox>
              </MuiPaper>
            </MuiGrid>
          ))}
        </MuiGrid>
      )}
    </MuiBox>
  )
}
