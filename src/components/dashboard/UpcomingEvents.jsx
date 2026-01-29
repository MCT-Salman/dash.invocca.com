// src\components\dashboard\UpcomingEvents.jsx
/**
 * Upcoming Events Component - عرض الفعاليات القادمة
 */

import MuiBox from '@/components/ui/MuiBox'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiChip from '@/components/ui/MuiChip'
import MuiDivider from '@/components/ui/MuiDivider'
import { Calendar, Clock, Users, MapPin } from 'lucide-react'

/**
 * Event Card - بطاقة فعالية
 */
function EventCard({ event, index }) {
  const statusColors = {
    pending: { bg: 'var(--color-warning-50)', text: 'var(--color-warning-700)', label: 'قيد الانتظار' },
    confirmed: { bg: 'var(--color-info-50)', text: 'var(--color-info-700)', label: 'مؤكد' },
    in_progress: { bg: 'var(--color-secondary-100)', text: 'var(--color-secondary-700)', label: 'جاري' },
    completed: { bg: 'var(--color-success-50)', text: 'var(--color-success-700)', label: 'مكتمل' },
    cancelled: { bg: 'var(--color-error-50)', text: 'var(--color-error-700)', label: 'ملغي' }
  }

  const status = statusColors[event.status] || statusColors.pending

  return (
    <MuiBox
      sx={{
        p: 3,
        borderBottom: index !== undefined ? '1px solid var(--color-border)' : 'none',
        transition: 'all 0.3s ease',
        borderRadius: '16px',
        '&:hover': {
          backgroundColor: 'var(--color-surface-hover)',
        },
        '&:last-child': {
          borderBottom: 'none'
        }
      }}
    >
      <MuiBox className="flex items-start justify-between gap-4 mb-3">
        <MuiBox className="flex-1">
          <MuiTypography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-text-primary)', mb: 0.5 }}>
            {event.eventName || event.name}
          </MuiTypography>
          <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
            {typeof event.eventType === 'object'
              ? (event.eventType.label || event.eventType.name || String(event.eventType))
              : (event.eventType || 'فعالية')}
          </MuiTypography>
        </MuiBox>

        <MuiChip
          label={status.label}
          size="small"
          sx={{
            backgroundColor: status.bg,
            color: status.text,
            fontWeight: 600,
            fontSize: '0.75rem',
            height: 28,
            borderRadius: '8px'
          }}
        />
      </MuiBox>

      <MuiBox className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Date */}
        <MuiBox className="flex items-center gap-2">
          <Calendar size={16} style={{ color: 'var(--color-primary-500)' }} className="flex-shrink-0" />
          <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
            {event.eventDate || event.date}
          </MuiTypography>
        </MuiBox>

        {/* Time */}
        {event.startTime && (
          <MuiBox className="flex items-center gap-2">
            <Clock size={16} style={{ color: 'var(--color-primary-500)' }} className="flex-shrink-0" />
            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
              {event.startTime} - {event.endTime}
            </MuiTypography>
          </MuiBox>
        )}

        {/* Guests */}
        {event.guestCount && (
          <MuiBox className="flex items-center gap-2">
            <Users size={16} style={{ color: 'var(--color-primary-500)' }} className="flex-shrink-0" />
            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
              {event.guestCount} ضيف
            </MuiTypography>
          </MuiBox>
        )}

        {/* Client */}
        {event.client && (
          <MuiBox className="flex items-center gap-2">
            <MapPin size={16} style={{ color: 'var(--color-primary-500)' }} className="flex-shrink-0" />
            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
              {event.client.name || event.clientName}
            </MuiTypography>
          </MuiBox>
        )}
      </MuiBox>
    </MuiBox>
  )
}

/**
 * Upcoming Events List
 */
export default function UpcomingEvents({ events = [], title = "الفعاليات القادمة" }) {
  if (!events || events.length === 0) {
    return (
      <MuiPaper elevation={0} className="p-8 rounded-2xl border-2 border-border bg-white text-center">
        <Calendar size={48} className="mx-auto mb-4 text-text-disabled" />
        <MuiTypography variant="h6" className="text-text-secondary mb-2">
          لا توجد فعاليات قادمة
        </MuiTypography>
        <MuiTypography variant="body2" className="text-text-disabled">
          سيتم عرض الفعاليات المجدولة هنا
        </MuiTypography>
      </MuiPaper>
    )
  }

  return (
    <MuiPaper
      elevation={0}
      sx={{
        borderRadius: '24px',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-paper)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Header */}
      <MuiBox sx={{ p: 3, backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <MuiBox className="flex items-center gap-3">
          <MuiBox sx={{
            width: 48,
            height: 48,
            borderRadius: '16px',
            backgroundColor: 'var(--color-primary-500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calendar size={24} style={{ color: 'var(--color-text-on-primary)' }} strokeWidth={2.5} />
          </MuiBox>
          <MuiBox>
            <MuiTypography variant="h5" sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {title}
            </MuiTypography>
            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
              {events.length} فعالية مجدولة
            </MuiTypography>
          </MuiBox>
        </MuiBox>
      </MuiBox>

      {/* Events List */}
      <MuiBox>
        {events.map((event, index) => (
          <EventCard key={event._id || event.id || index} event={event} index={index} />
        ))}
      </MuiBox>
    </MuiPaper>
  )
}

