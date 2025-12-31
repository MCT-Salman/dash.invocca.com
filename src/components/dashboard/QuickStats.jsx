// src/components/dashboard/QuickStats.jsx
/**
 * Quick Stats Component - عرض إحصائيات سريعة بتصميم جذاب
 */

import MuiBox from '@/components/ui/MuiBox'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiLinearProgress from '@/components/ui/MuiLinearProgress'
import { TrendingUp, TrendingDown } from 'lucide-react'

/**
 * Quick Stat Card with progress bar
 */
export function QuickStatCard({ 
  title, 
  value, 
  total, 
  icon: Icon, 
  color = '#D8B98A',
  trend,
  trendValue 
}) {
  const percentage = total ? Math.round((value / total) * 100) : 0

  return (
    <MuiPaper
      elevation={0}
      className="p-6 rounded-2xl border-2 border-border hover:border-secondary-300 transition-all duration-300 hover:shadow-lg bg-white"
    >
      <MuiBox className="flex items-start justify-between mb-4">
        <MuiBox className="flex-1">
          <MuiTypography variant="body2" className="text-text-secondary font-medium mb-1">
            {title}
          </MuiTypography>
          <MuiTypography variant="h4" className="font-bold" style={{ color }}>
            {value}
            {total && (
              <MuiTypography component="span" variant="body2" className="text-text-secondary mr-2">
                / {total}
              </MuiTypography>
            )}
          </MuiTypography>
        </MuiBox>

        {Icon && (
          <MuiBox
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}20`, color }}
          >
            <Icon size={24} strokeWidth={2.5} />
          </MuiBox>
        )}
      </MuiBox>

      {/* Progress Bar */}
      {total && (
        <MuiBox className="mb-3">
          <MuiLinearProgress
            variant="determinate"
            value={percentage}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#f3f4f6',
              '& .MuiLinearProgress-bar': {
                backgroundColor: color,
                borderRadius: 4,
              }
            }}
          />
        </MuiBox>
      )}

      {/* Trend Indicator */}
      {trend && (
        <MuiBox className="flex items-center gap-2">
          {trend === 'up' ? (
            <TrendingUp size={16} className="text-success-600" />
          ) : (
            <TrendingDown size={16} className="text-error-600" />
          )}
          <MuiTypography 
            variant="caption" 
            className={`font-semibold ${trend === 'up' ? 'text-success-600' : 'text-error-600'}`}
          >
            {trendValue}
          </MuiTypography>
          <MuiTypography variant="caption" className="text-text-secondary">
            عن الشهر الماضي
          </MuiTypography>
        </MuiBox>
      )}
    </MuiPaper>
  )
}

/**
 * Mini Stat Card - بطاقة إحصائية صغيرة
 */
export function MiniStatCard({ label, value, icon: Icon, color = '#D8B98A' }) {
  return (
    <MuiBox className="flex items-center gap-3 p-4 rounded-xl bg-surface hover:bg-surface-hover transition-colors">
      {Icon && (
        <MuiBox
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}20`, color }}
        >
          <Icon size={20} strokeWidth={2.5} />
        </MuiBox>
      )}
      <MuiBox className="flex-1">
        <MuiTypography variant="caption" className="text-text-secondary block">
          {label}
        </MuiTypography>
        <MuiTypography variant="h6" className="font-bold text-text-primary">
          {value}
        </MuiTypography>
      </MuiBox>
    </MuiBox>
  )
}

/**
 * Stat Grid - شبكة إحصائيات
 */
export function StatGrid({ stats = [] }) {
  return (
    <MuiBox className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <MiniStatCard key={index} {...stat} />
      ))}
    </MuiBox>
  )
}

export default QuickStatCard

