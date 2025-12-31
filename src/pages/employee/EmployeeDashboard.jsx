// src\pages\employee\EmployeeDashboard.jsx
import MuiBox from '@/components/ui/MuiBox'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiTypography from '@/components/ui/MuiTypography'
import { useNavigate } from 'react-router-dom'
import { QrCode, ClipboardList, Clock, CheckCircle2 } from 'lucide-react'
import { SEOHead, EmptyState } from '@/components/common'
import { useAuth } from '@/hooks'
import { formatNumber, formatEmptyValue } from '@/utils/helpers'

// eslint-disable-next-line no-unused-vars
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

// eslint-disable-next-line no-unused-vars
function ActionCard({ title, description, icon: Icon, onClick, color = 'var(--color-primary-500)' }) {
  return (
    <MuiPaper
      elevation={0}
      onClick={onClick}
      sx={{
        p: 3,
        cursor: 'pointer',
        background: 'var(--color-surface-dark)',
        border: '1px solid var(--color-border-glass)',
        borderRadius: '16px',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: color,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        }
      }}
    >
      <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <MuiBox
          sx={{
            width: 56,
            height: 56,
            borderRadius: '14px',
            background: `linear-gradient(135deg, ${color}, ${color}CC)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 12px ${color}40`
          }}
        >
          <Icon size={28} style={{ color: '#fff' }} />
        </MuiBox>
        <MuiBox sx={{ flex: 1 }}>
          <MuiTypography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-text-primary-dark)', mb: 0.5 }}>
            {title}
          </MuiTypography>
          <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
            {description}
          </MuiTypography>
        </MuiBox>
      </MuiBox>
    </MuiPaper>
  )
}

export default function EmployeeDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Mock data - replace with actual API call when available
  const stats = {
    totalTasks: 0,
    completedTasks: 0,
    todayEvents: 0,
  }

  return (
    <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
      <SEOHead title="لوحة تحكم الموظف - INVOCCA" />

      {/* Header */}
      <MuiBox sx={{ mb: 4 }}>
        <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700, mb: 1 }}>
          مرحباً بك، {formatEmptyValue(user?.name)}
        </MuiTypography>
        <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
          إليك المهام والأدوات المتاحة لك اليوم
        </MuiTypography>
      </MuiBox>

      {/* Stats Grid */}
      <MuiGrid container spacing={3} sx={{ mb: 4 }}>
        <MuiGrid item xs={12} sm={6} md={4}>
          <StatCard
            title="إجمالي المهام"
            value={stats.totalTasks}
            icon={ClipboardList}
            color="var(--color-primary-500)"
          />
        </MuiGrid>
        <MuiGrid item xs={12} sm={6} md={4}>
          <StatCard
            title="المهام المكتملة"
            value={stats.completedTasks}
            icon={CheckCircle2}
            color="var(--color-success-500)"
          />
        </MuiGrid>
        <MuiGrid item xs={12} sm={6} md={4}>
          <StatCard
            title="فعاليات اليوم"
            value={stats.todayEvents}
            icon={Clock}
            color="var(--color-info-500)"
          />
        </MuiGrid>
      </MuiGrid>

      {/* Main Action Cards */}
      <MuiGrid container spacing={3} sx={{ mb: 4 }}>
        <MuiGrid item xs={12} md={6}>
          <ActionCard
            title="ماسح التذاكر"
            description="ابدأ بمسح كود الـ QR الخاص بالضيوف"
            icon={QrCode}
            color="var(--color-primary-500)"
            onClick={() => navigate('/employee/scanner')}
          />
        </MuiGrid>
        <MuiGrid item xs={12} md={6}>
          <ActionCard
            title="قائمة المهام"
            description="عرض المهام والفعاليات المكلف بها"
            icon={ClipboardList}
            color="var(--color-secondary-500)"
            onClick={() => navigate('/employee/tasks')}
          />
        </MuiGrid>
      </MuiGrid>

      {/* Today's Schedule */}
      <MuiBox sx={{ mb: 2 }}>
        <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
          فعاليات اليوم
        </MuiTypography>
      </MuiBox>
      <MuiPaper
        elevation={0}
        sx={{
          p: 4,
          background: 'var(--color-surface-dark)',
          border: '1px solid var(--color-border-glass)',
          borderRadius: '16px',
        }}
      >
        <EmptyState
          title="لا توجد فعاليات"
          description="لا توجد فعاليات مجدولة لك اليوم."
          icon={Clock}
        />
      </MuiPaper>
    </MuiBox>
  )
}
