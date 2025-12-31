// src\pages\employee\Tasks.jsx
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiChip from '@/components/ui/MuiChip'
import { ClipboardList, Calendar, MapPin } from 'lucide-react'
import { SEOHead, EmptyState } from '@/components/common'
import { formatDate, formatEmptyValue } from '@/utils/helpers'

export default function Tasks() {
  // Mock data - replace with actual API call when available
  const tasks = []

  return (
    <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
      <SEOHead title="المهام - INVOCCA" />

      {/* Header */}
      <MuiBox sx={{ mb: 4 }}>
        <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700, mb: 1 }}>
          قائمة المهام
        </MuiTypography>
        <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
          الفعاليات والمهام الموكلة إليك
        </MuiTypography>
      </MuiBox>

      {tasks.length > 0 ? (
        <MuiGrid container spacing={3}>
          {tasks.map((task) => (
            <MuiGrid item xs={12} md={6} key={task._id}>
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
                    {formatEmptyValue(task.name)}
                  </MuiTypography>
                  <MuiChip
                    label={task.status === 'completed' ? 'مكتمل' : task.status === 'in_progress' ? 'قيد التنفيذ' : 'معلق'}
                    size="small"
                    sx={{
                      backgroundColor: task.status === 'completed' 
                        ? 'rgba(34, 197, 94, 0.2)' 
                        : task.status === 'in_progress'
                        ? 'rgba(59, 130, 246, 0.2)'
                        : 'rgba(251, 191, 36, 0.2)',
                      color: task.status === 'completed' 
                        ? '#22c55e' 
                        : task.status === 'in_progress'
                        ? '#3b82f6'
                        : '#fbbf24',
                      fontWeight: 600,
                    }}
                  />
                </MuiBox>

                <MuiGrid container spacing={2}>
                  {task.eventDate && (
                    <MuiGrid item xs={6}>
                      <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                        <Calendar size={16} />
                        <MuiTypography variant="body2">
                          {formatDate(task.eventDate)}
                        </MuiTypography>
                      </MuiBox>
                    </MuiGrid>
                  )}
                  {task.location && (
                    <MuiGrid item xs={6}>
                      <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                        <MapPin size={16} />
                        <MuiTypography variant="body2">
                          {formatEmptyValue(task.location)}
                        </MuiTypography>
                      </MuiBox>
                    </MuiGrid>
                  )}
                  {task.description && (
                    <MuiGrid item xs={12}>
                      <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                        {formatEmptyValue(task.description)}
                      </MuiTypography>
                    </MuiGrid>
                  )}
                </MuiGrid>
              </MuiPaper>
            </MuiGrid>
          ))}
        </MuiGrid>
      ) : (
        <EmptyState
          title="لا توجد مهام"
          description="لا توجد مهام موكلة إليك في الوقت الحالي."
          icon={ClipboardList}
        />
      )}
    </MuiBox>
  )
}
